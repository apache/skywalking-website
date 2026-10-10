---
title: "Recorded as the Session Runs, Kept When It Ends: LangGraph on Amazon Bedrock AgentCore"
date: 2026-10-10
author: Sheng Wu
description: "Run a LangGraph agent on Amazon Bedrock AgentCore Runtime and record every turn, model prompt, tool call and file change in Apache SkyWalking AI Sessionizer while the session runs, kept after it ends, with no change to the agent's logic."
tags:
  - AI
  - Engineering
  - Community
---

![A LangGraph agent's turns on Amazon Bedrock AgentCore Runtime, recorded by Apache SkyWalking AI Sessionizer while the session runs and kept after the session ends.](agentcore-replay-featured.png)

On **[Amazon Bedrock AgentCore Runtime](https://aws.amazon.com/bedrock/agentcore/)**, each session runs in its own isolated execution environment, with its own CPU, memory and disk. An agent that keeps its conversation in that memory and its working files on that disk, as the simplest LangGraph agent does, loses both when AgentCore stops the environment, by default after 15 idle minutes. The session id stays valid; the next call with it gets a new environment, empty.

So when an answer is wrong, or a file the agent wrote is, the evidence can be gone before anyone asks the questions that matter: **what exactly was the model sent on that turn, which tool result led it there, and what did the tools actually change?**

This post runs a LangGraph agent on AgentCore Runtime with [Apache SkyWalking AI Sessionizer](https://github.com/apache/skywalking-ai-sessionizer) recording each turn as it happens: the runs, model calls and tool calls through LangChain's own tracing client, and the files a tool changed through a small recorder. Sessionizer, a separate, long-lived service, keeps that record after the session's environment stops. The agent's logic does not change for it; the runtime's environment and a package in the image switch it on. Everything below ran on AWS in `us-east-1` on October 10, 2026, with **Amazon Nova Pro** on Amazon Bedrock, from one OpenTofu configuration: [wu-sheng/aws-agentcore-asz-demo](https://github.com/wu-sheng/aws-agentcore-asz-demo). The [previous post](/blog/2026-09-23-ai-sessionizer-langchain-langgraph/) (also on [AWS Builder Center](https://builder.aws.com/content/3JiYSnJv2MR1OQ5mO6Psqs0NkpB/from-claude-code-to-your-own-agent-capture-and-replay-langchain-and-langgraph-conversations)) did the same for an agent on a laptop.

## Configuration, not code

The agent is a small LangGraph "deployment advisor" with six tools. Three look facts up: `search_docs`, `check_deployment` and `estimate_cost`. Three work on a clone of the demo repository inside the session's environment: `clone_demo_repo`, `read_file` and `write_file`. Its only AgentCore-specific code is the entrypoint, which any agent on AgentCore has. Shortened from the demo's `agent/app.py`:

```python
from bedrock_agentcore.runtime import BedrockAgentCoreApp, BedrockAgentCoreContext
from langchain_core.messages import HumanMessage

graph = build_graph()   # Nova Pro, six tools, compiled with an InMemorySaver
app = BedrockAgentCoreApp()


@app.entrypoint
def invoke(payload: dict) -> dict:
    # One AgentCore runtime session is one conversation.
    thread_id = payload.get("thread_id") or BedrockAgentCoreContext.get_session_id()
    result = graph.invoke(
        {"messages": [HumanMessage(payload["prompt"])]},
        config={"configurable": {"thread_id": thread_id},
                "metadata": {"thread_id": thread_id}},
    )
    return {"thread_id": thread_id, "answer": result["messages"][-1].text}
```

Nothing there is about Sessionizer. The recording rides on two things a LangChain agent already has: the `langsmith` tracing client, which comes with `langchain-core`, and LangChain's callback hooks. The runtime's environment turns both on:

```hcl
environment_variables = {
  # The conversation: runs, model calls, tool calls.
  LANGSMITH_TRACING  = "true"
  LANGSMITH_ENDPOINT = "http://${aws_lb.ingest.dns_name}:1985"
  LANGSMITH_API_KEY  = random_password.asz_ingest_token.result
  LANGSMITH_PROJECT  = "aws-agentcore-asz-demo"
  # What the tools changed on disk.
  ASZ_CHANGES        = "true"
  ASZ_WATCH          = "/home/agent/workspace"
  ASZ_CHANGES_DATA   = "/mnt/changes"
}
```

The first four point the tracing client at Sessionizer's receiver instead of LangSmith's cloud, the same four as on the laptop with a different address. The other three switch on file-change recording. The image carries `asz-changes`, built from the Sessionizer source, and a small LangChain shim, installed with `pip` and switched on with `asz-langchain enable`; the application never imports it. At interpreter start the shim attaches a callback that runs `asz-changes` before and after each tool the settings name, here `write_file` only, and `asz-changes` writes what changed to a directory Sessionizer reads. What the agent supplies is the conversation's identity: on AgentCore, the runtime session id the caller sent, which the agent reads from the request, passes to LangGraph as the thread, and also puts in the run metadata.

That is the convenience: the agent's logic, its framework and its model calls stay as they are. What changes is configuration on the runtime and a package in the image.

## Two services, two lifecycles

The tracing client inside the agent neither knows nor cares that it runs on AgentCore. Four things around it change on AgentCore.

- **There is no sidecar.** AgentCore Runtime runs one image per agent, in an environment per session, and an environment lives only as long as its session. Sessionizer is the opposite: a long-lived service with durable storage and a replay page. So the two run as separate services, Sessionizer as one task on **Amazon Elastic Container Service (ECS)** with **AWS Fargate**.
- **`127.0.0.1` is now the session's environment.** AgentCore's VPC mode places the agent's network interfaces in subnets you choose of your **Amazon Virtual Private Cloud (VPC)**, so the receiver can stay private, behind an internal **Application Load Balancer (ALB)** only the agent's security group may call.
- **File changes need shared storage.** `asz-changes` writes on the agent's side and Sessionizer reads on its own, so the two share a directory on the network: **Amazon Elastic File System (EFS)**, AWS's managed network file system, mounted over NFS inside the VPC. AgentCore mounts an EFS access point into every session's environment at `/mnt/changes`, and Sessionizer's task mounts the same directory at `/asz/changes`. Neither side reaches into the other.
- **The session is the conversation.** The caller keeps the session id: it picks one, at least 33 characters, or takes the one AgentCore returns from the first call, and sends it with every call of the conversation. AgentCore routes calls with the same id to the same session, and the id stays valid after an idle stop. The agent only reads the id of the request, with `BedrockAgentCoreContext.get_session_id()`, and uses it as the thread, so one AgentCore session is one Sessionizer conversation.

![Figure 1: The caller invokes the agent on AgentCore Runtime with a session id. The agent sends the LangSmith wire to an internal load balancer in front of AI Sessionizer on ECS Fargate, and asz-changes writes file changes to Amazon EFS, which Sessionizer also reads. The agent reaches Amazon Nova Pro on Bedrock through a NAT gateway; you open the replay page through a public load balancer only your IP may reach.](agentcore-topology.svg)
Figure 1: Two services, two lifecycles. The agent is ephemeral and per session; Sessionizer is persistent and shared. Two paths connect them: the LangSmith wire to a private receiver, and file changes through a shared EFS directory.</br>

## Wiring it on AWS

The [demo repository](https://github.com/wu-sheng/aws-agentcore-asz-demo) builds everything in Figure 1 with OpenTofu, the agent included. AWS provider 6.x has an `aws_bedrockagentcore_agent_runtime` resource, so the runtime sits in the same state as the network, the storage and the receiver it points at. Beside the environment above, the runtime needs its network and the shared directory:

```hcl
resource "aws_bedrockagentcore_agent_runtime" "agent" {
  # ...
  network_configuration {
    network_mode = "VPC"
    network_mode_config {
      subnets         = aws_subnet.private[*].id
      security_groups = [aws_security_group.agent.id]
    }
  }

  filesystem_configuration {
    efs_access_point {
      access_point_arn = aws_efs_access_point.changes.arn
      mount_path       = "/mnt/changes"
    }
  }
}
```

Sessionizer runs from its published multi-arch image as one ECS Fargate task, with two adapters: the receiver for the conversation and the `changes` adapter for the file changes.

```yaml
storage:
  root: /asz/data
adapters:
  - name: langsmith-ingest
    enabled: true
    listen: 0.0.0.0:1985
    token: <generated>
    collector: { mode: watch, interval: 30s }
  - name: changes
    enabled: true
    source_root: /asz/changes
    collector: { mode: watch, interval: 30s }
```

A few details decide whether this works the first time:

- **The receiver.** It is an adapter of its own, off by default, on port 1985, not on the replay page's 8787. Its default address is `127.0.0.1:1985`, which no load balancer can reach inside a container, so it listens on `0.0.0.0`. And it assembles what it received every 30 seconds here, instead of its default ten minutes.
- **The shared directory.** The EFS access point writes everything as uid 65532, the user Sessionizer runs as, so Sessionizer owns what the agent wrote. The execution role needs `elasticfilesystem:ClientMount` and `ClientWrite` on the file system, conditioned on the access point, as the AgentCore guide says. `CreateAgentRuntime` also checks `elasticfilesystem:DescribeAccessPoints` and `DescribeMountTargets`, which the guide does not list, and it checks them without a resource, so a policy scoped to the file system is refused. The demo grants those two read-only actions on `*`.
- **One workspace per conversation.** `asz-changes` keeps one baseline per watched directory, and every session shares its data directory. With one workspace path for all of them, a conversation's first watched tool call is compared with another session's leftovers. The demo's agent works in a directory per conversation and points `ASZ_WATCH` at it each turn.
- **The image.** AgentCore runs images only from **Amazon Elastic Container Registry (ECR)**. The demo's image is built and published by GitHub Actions; `up.sh` copies it into the account's ECR.

This is a demonstration, so a few things in it are not how you would run it for a team. The replay page is plain HTTP, behind a load balancer only your IP may reach, and has no login of its own. The receiver token sits in the environment, where **AWS Secrets Manager** belongs. And the agent's memory is in memory, the subject of [a later section](#when-the-session-goes-idle).

## One session, one conversation

The demo has no chat application. `invoke.sh` stands in for one user's client: it creates one session id, then sends five prepared questions with `aws bedrock-agentcore invoke-agent-runtime`, all with that `--runtime-session-id`, and a sixth follows on the same session after a long pause, sent the same way. Each is a separate invocation, and all of them land in one conversation in Sessionizer, named from the project and the session id.

In a real deployment, the application around the agent controls the session itself: it keeps one session id for each user's conversation, sends it with every message, and starts a new one when a conversation should start fresh. AgentCore does not map sessions to users, and the agent only reads the id each request carries.

![Figure 2: The Sessionizer conversation list, served from ECS Fargate, with the conversation that ran on AgentCore Runtime.](conversation-list.png)
Figure 2: One conversation: six talks, 19 model calls and one file change of 29 lines, over 17 minutes. Its title is the first question; the id under it holds the project and the AgentCore session id, shortened, and `invoke.sh` prints the full id.</br>

![Figure 3: The conversation, one talk per AgentCore invocation, each opening with the question the caller sent and ending with the agent's answer.](conversation-page.png)
Figure 3: Six AgentCore invocations, one conversation. Each talk opens with the question the caller sent and ends with the agent's answer.</br>

Opening a talk shows the agent loop inside it. The second question asks why tracing to port 8787 landed nothing; Nova Pro called `search_docs` with `ingest_port` and answered from the result:

![Figure 4: The second talk expanded: two model calls, the search_docs tool step with its input and result, and the agent's response.](turn-steps.png)
Figure 4: The second talk: the model calls, and the tool step with its input and its result shown together.</br>

## What the model was sent

The first question this post asked is answered by the model call's Prompt tab. Sessionizer lands what each call was sent beside the conversation and rebuilds it on request:

![Figure 5: The Prompt tab of the second talk's last model call: the system prompt, the first question, the model's reasoning, its search_docs call and result, the first answer, the second question and its tool call and result.](prompt-request.png)
Figure 5: The second talk's last model call, 1,140 tokens in and 78 out. Its eight messages include the whole first talk, which ran in a different AgentCore invocation.</br>

The prompt proves the session carried the history: the first question, Nova Pro's reasoning, its tool call, the result and the answer all belonged to an earlier invocation. That is the in-memory checkpointer at work inside one environment. As in the previous post, the body is LangChain's view of what it sent, not the bytes Bedrock received, and the record says so.

## What the tools changed, and what the agent said they changed

The fifth question asks the agent to clone the demo repository and prepare `infra/terraform/terraform.tfvars` from the example, with a new IP and idle sessions stopped after five minutes. Nova Pro answered:

> The `infra/terraform/terraform.tfvars` file has been successfully created with the specified values, including the `agentcore_idle_timeout` set to stop idle sessions after 5 minutes.

The file is in the session environment's local workspace, and that copy is lost when the environment stops. Sessionizer keeps what `asz-changes` recorded while `write_file` ran, in that step's Changes tab.

![Figure 6: The write_file tool step's Changes tab: observed by the asz plugin, the workspace scanned before and after the call, and terraform.tfvars created with 29 lines, ending in agentcore_idle_timeout = "5m".](tool-change.png)
Figure 6: What the tool did, not what the agent said: `terraform.tfvars` created in the session's workspace, 29 lines, the diff in full.</br>

The IP is right. The last line is not. The demo has no variable named `agentcore_idle_timeout`; the line should have read `agent_idle_session_timeout = 300`, in seconds. With the invented name, OpenTofu would only warn about an undeclared variable and keep the default 15 minutes. The same talk's tool calls say why: the agent read `terraform.tfvars.example`, which has no idle-timeout line, never opened `variables.tf`, and made a name up. The answer reads as done; the record shows what was done.

## When the session goes idle

By default AgentCore stops a session's execution environment after 15 idle minutes, or after 8 hours at most. The session id stays valid, and the next call with it gets a new environment. The [AgentCore documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html) is plain about what that costs: data kept in memory, conversation history included, lasts only as long as the compute it was kept in. The workspace on its disk goes the same way.

![Figure 7: One conversation across two execution environments of one AgentCore session: turns 1 to 5 in the first, recorded as they ran; the 15-minute idle timeout stops it; turn 6 runs on the same session in a new environment, without history or repository clone; Sessionizer's record holds all six turns and the terraform.tfvars diff.](idle-timeline.svg)
Figure 7: The record continues where the session's environment does not.</br>

**The conversation does not stop with the environment. The caller sends the same session id after the stop, the agent uses it as the same thread, and Sessionizer files the next call in the same conversation, after the turns before it.** In this run, `invoke.sh` sent the sixth question with the session id it had used for the first five, and the sixth talk landed in the conversation that held the first five, about sixteen minutes after the fifth: Figure 3 shows it below the fifth, after a "16 min quiet" mark, and Figure 2 counts six talks. Sessionizer records the pause as a new activity window, a second segment of the same conversation, and every prompt, tool call and file change from before the stop stays in the record.

What the stop did take is the agent's own context. The sixth question went out on the same session id about sixteen minutes after the fifth: "Earlier in this session you changed a file in my repository. Which file was it, and what did you change?" Nova Pro answered:

> The file that was changed earlier in this session is `infra/terraform/terraform.tfvars.example`. The changes made to the file were the addition of the `aws_region` and `project_name` variables, as well as the modification of the `asz_ui_cidrs` variable to include your public IP address.

It names the wrong file and misstates what was done: the file was `terraform.tfvars`, it was created, and its invented line was `agentcore_idle_timeout`. Nothing failed, and the answer is fluent. Sessionizer, which received this turn the same way as the five before it, shows why:

![Figure 8: The Prompt tab of the sixth talk's first model call: two messages, the system prompt and the new question, 687 bytes.](idle-prompt.png)
Figure 8: The sixth talk's first model call: the system prompt and the new question, and nothing before them.</br>

That call was sent 791 tokens, about what the first talk's first call was sent, 796; the fifth talk's first call, in the old environment, had been sent 2,010. The checkpointer started empty in a new environment. The agent then cloned the repository again, since the clone had gone with the old environment, read the example file, and described it as its own work. In the previous talk of the same conversation, the `write_file` step still holds the real change (Figure 6).

That is what recording while the session runs is worth on AgentCore. When the session's environment is gone, the agent's memory and its files are gone with it, and its account of what happened is only as good as what it can still see. The record is not: in Sessionizer the conversation went on across the stop, six talks in one record, and it still holds what the agent no longer can.

Sessionizer keeps that record for you to read; it does not hand it back to the agent. The fix for the agent's memory belongs in the agent: keep LangGraph's checkpoints somewhere that outlives the session's environment. `AgentCoreMemorySaver` from [`langgraph-checkpoint-aws`](https://pypi.org/project/langgraph-checkpoint-aws/) keeps them in **Amazon Bedrock AgentCore Memory**, and AgentCore's [session storage](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-filesystem-configurations.html), in preview, keeps a session's files across stop and resume. The idle timeout itself is the runtime's `lifecycle_configuration`, which the demo exposes as `agent_idle_session_timeout`, but changing it only moves the point where the history is lost. After the change, the same Prompt tab is how you check it: the first call after the pause should open with the turns before it.

## Next to AgentCore Observability

AgentCore has observability of its own. In **Amazon CloudWatch** it shows the runtime's sessions, their traces and spans, and with OpenTelemetry instrumentation in the agent, the model and tool calls inside them and their intermediate outputs. That is the place to watch the runtime across every session: latency, errors and usage.

Sessionizer adds a conversation view: the turns of one session as one record across invocations and environments, each model call's request rebuilt beside it, each watched tool's diff attached to its step, all of it kept in storage you own. This demo sets up only that part.

## Share it through SkyWalking

This post ran Sessionizer in its simple mode: it collects, stores and serves the replay page itself. To make conversations from many agents available in SkyWalking, add an **OpenTelemetry Protocol (OTLP)** export to the same configuration, as the [previous post](/blog/2026-09-23-ai-sessionizer-langchain-langgraph/#share-it-with-the-team) shows. The conversations then appear in Horizon's **AI Agents** views under the runtime LangChain. Collection does not change: the agent still sends the LangSmith wire and the file changes, and OTLP carries only what Sessionizer has already landed.

## Try it on your AgentCore agent

### On an agent you already run

If your LangGraph or LangChain agent runs on AgentCore Runtime today, recording it takes four steps, none of them in the agent's logic:

1. **Run Sessionizer where the runtime can reach it**, with the `langsmith-ingest` receiver on, a token, and `listen: 0.0.0.0:1985`. The demo runs it as one ECS task behind an internal ALB.
2. **Set four environment variables on the runtime**: `LANGSMITH_TRACING=true`, `LANGSMITH_ENDPOINT` at the receiver, `LANGSMITH_API_KEY` as its token, and `LANGSMITH_PROJECT`.
3. **Use the session id as the conversation**: pass `BedrockAgentCoreContext.get_session_id()` as the LangGraph thread and put it in the run metadata.
4. **To record file changes too**, add `asz-changes` and `apache-skywalking-asz-langchain` to the image, from the same Sessionizer commit as the server, and run `asz-langchain enable`. Name the tools that write in the recorder's `settings.yaml`, set the three `ASZ_*` variables, and mount one EFS access point into the runtime and into Sessionizer, where the `changes` adapter reads it.

The [LangChain and LangGraph guide](https://skywalking.apache.org/docs/skywalking-ai-sessionizer/next/en/setup/langchain/) covers steps 1 to 3, and the [plugin guide](https://skywalking.apache.org/docs/skywalking-ai-sessionizer/next/en/setup/langchain-plugin/) covers step 4.

### Run the demo

You need an AWS account with the AWS CLI signed in, OpenTofu and Docker. From a clone of the [demo repository](https://github.com/wu-sheng/aws-agentcore-asz-demo):

```sh
cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars
# set asz_ui_cidrs to your IP:  curl -s https://checkip.amazonaws.com
./scripts/up.sh       # about ten minutes
./scripts/invoke.sh   # the five turns; prints the session id and the replay page
./scripts/down.sh     # when you are done
```

- **The model.** Amazon Nova Pro is the default and needs no extra step; `BEDROCK_MODEL_ID=<model id> ./scripts/up.sh` picks another. Claude models need the account's one-time Anthropic use-case form, and AWS does not serve every newer Claude model to every account, so `up.sh` calls the model once and stops before it creates anything if the account cannot use it.
- **The agent image.** GitHub Actions builds it and publishes it to GitHub Container Registry; `up.sh` copies it into your account's ECR, since AgentCore runs images only from there. Nothing is built on your machine.
- **The region.** AgentCore's VPC mode works only in [some Availability Zones](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-vpc.html): `use1-az1`, `use1-az2` and `use1-az4` in `us-east-1`. Set `availability_zone_ids` if `up.sh` stops at the runtime's subnets.
- **The cost.** The fixed infrastructure costs about $0.125 an hour while it is up, most of it the NAT gateway and the two load balancers, before AgentCore, Bedrock and storage usage.
- **The teardown.** `down.sh` deletes everything, the recorded conversations included. AWS keeps AgentCore's network interfaces for hours after the runtime is gone, about ten in our run, and with them the VPC, two subnets and a security group, none of which cost anything. `down.sh` says so and exits; `./scripts/down.sh check` shows the progress, and `./scripts/down.sh --yes` later finishes.

### What to look at

Open the replay page `invoke.sh` printed, then:

1. **The second talk's last model call, Prompt tab.** The first talk is in it, although it ran in another invocation.
2. **The fifth talk's `write_file` step, Changes tab.** What the tool wrote, next to what the agent said it wrote.
3. **A turn after the idle timeout.** Wait at least 15 minutes, send one more turn on the same session with `SESSION=<session id> ./scripts/invoke.sh "<question>"`, and open its first model call. The earlier turns are not in it, and the agent answers as if they never happened.

Then point an agent you already run at Sessionizer, and the next time a session surprises someone, read what the model was sent, and what its tools did, on the turn that went wrong.

Questions and findings are welcome in [Apache SkyWalking Discussions](https://github.com/apache/skywalking/discussions), and the source is in the [Apache SkyWalking AI Sessionizer repository](https://github.com/apache/skywalking-ai-sessionizer).
