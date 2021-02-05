---
title: "[Design] The Verifier of NGE2E"
date: 2021-02-01
author: "[Zhenxu Ke](https://github.com/kezhenxu94), Tetrate.io; [Huaxi Jiang](http://github.com/fgksgf), Committer; [Ke Zhang](http://github.com/HumbertZhang), Committer"
description: "The design of Next Generation End-to-End Testing Framework  Verifier"

tags:
- Testing
---

## Background

The verifier is an important part of the next generation End-to-End Testing framework (NGE2E), which is responsible for verifying whether the actual output satisfies the expected template.

## Design Thinking

We will implement the verifier with [Go template](https://golang.org/pkg/text/template/), plus some enhancements. Firstly, users need to write a Go template file with provided functions and actions to describe how the expected data looks like. Then the verifer renders the template with the actual data object. Finally, the verifier compares the rendered output with the actual data. If the rendered output is not the same with the actual output, it means the actual data is inconsist with the expected data. Otherwise, it means the actual data match the expected data. On failure, the verifier will also print out what are different between expected and actual data.

## Branches / Actions

The verifier inherits all the actions from the standard Go template, such as `if`, `with`, `range`, etc. In addition, we also provide some custom actions to satisfy our own needs.

### List Elements Match

`contains` checks if the actual list contains elements that match the given template.

Examples:

```yaml
metrics:
{{- contains .metrics }}
  - name: {{ notEmpty .name }}
    id: {{ notEmpty .id }}
    value: {{ gt .value 0 }}
{{- end }}
```

It means that the list `metrics` must contain an element whose `name` and `id` are not empty, and `value` is greater than `0`.

```yaml
metrics:
{{- contains .metrics }}
  - name: p95
    value: {{ gt .value 0 }}
  - name: p99
    value: {{ gt .value 0 }}
{{- end }}
```

This means that the list `metrics` must contain an element named `p95` with a `value` greater than 0, and an element named `p95` with a `value` greater than 0. Besides the two element, the list `metrics` may or may not have other random elements.

## Functions

Users can use these provided functions in the template to describe the expected data.

### Not Empty

`notEmpty` checks if the string `s` is empty.

Example:

```yaml
id: {{ notEmpty .id }}
```

### Regexp match

`regexp` checks if string `s` matches the regular expression pattern.

Examples:

```yaml
label: {{ regexp .label "ratings.*" }}
```

### Base64

`b64enc s` returns the Base64 encoded string of s.

Examples:

```yaml
id: {{ b64enc "User" }}.static-suffix # this evalutes the base64 encoded string of "User", concatenated with a static suffix ".static-suffix"
```

Result:

```yaml
id: VXNlcg==.static-suffix
```

## Full Example

Here is an example of expected data:

```yaml
# expected.data.yaml
nodes:
  - id: {{ b64enc "User" }}.0
    name: User
    type: USER
    isReal: false
  - id: {{ b64enc "Your_ApplicationName" }}.1
    name: Your_ApplicationName
    type: Tomcat
    isReal: true
  - id: {{ $h2ID := (index .nodes 2).id }}{{ notEmpty $h2ID }} # We assert that nodes[2].id is not empty and save it to variable `h2ID` for later use
    name: localhost:-1
    type: H2
    isReal: false
calls:
  - id: {{ notEmpty (index .calls 0).id }}
    source: {{ b64enc "Your_ApplicationName" }}.1
    target: {{ $h2ID }} # We use the previously assigned variable `h2Id` to asert that the `target` is equal to the `id` of the nodes[2]
    detectPoints:
      - CLIENT
  - id: {{ b64enc "User" }}.0-{{ b64enc "Your_ApplicationName" }}.1
    source: {{ b64enc "User" }}.0
    target: {{ b64enc "Your_ApplicationName" }}.1
    detectPoints:
      - SERVER
```

will validate this data:

```yaml
# actual.data.yaml
nodes:
  - id: VXNlcg==.0
    name: User
    type: USER
    isReal: false
  - id: WW91cl9BcHBsaWNhdGlvbk5hbWU=.1
    name: Your_ApplicationName
    type: Tomcat
    isReal: true
  - id: bG9jYWxob3N0Oi0x.0
    name: localhost:-1
    type: H2
    isReal: false
calls:
  - id: WW91cl9BcHBsaWNhdGlvbk5hbWU=.1-bG9jYWxob3N0Oi0x.0
    source: WW91cl9BcHBsaWNhdGlvbk5hbWU=.1
    detectPoints:
      - CLIENT
    target: bG9jYWxob3N0Oi0x.0
  - id: VXNlcg==.0-WW91cl9BcHBsaWNhdGlvbk5hbWU=.1
    source: VXNlcg==.0
    detectPoints:
      - SERVER
    target: WW91cl9BcHBsaWNhdGlvbk5hbWU=.1
```

```yaml
# expected.data.yaml
metrics:
{{- contains .metrics }}
  - name: {{ notEmpty .name }}
    id: {{ notEmpty .id }}
    value: {{ gt .value 0 }}
{{- end }}
```

will validate this data:

```yaml
# actual.data.yaml
metrics:
  - name: business-zone::projectA
    id: YnVzaW5lc3Mtem9uZTo6cHJvamVjdEE=.1
    value: 1
  - name: system::load balancer1
    id: c3lzdGVtOjpsb2FkIGJhbGFuY2VyMQ==.1
    value: 0
  - name: system::load balancer2
    id: c3lzdGVtOjpsb2FkIGJhbGFuY2VyMg==.1
    value: 0
```

and will report an error when validating this data, because there is no element with a value greater than 0:

```yaml
# actual.data.yaml
metrics:
  - name: business-zone::projectA
    id: YnVzaW5lc3Mtem9uZTo6cHJvamVjdEE=.1
    value: 0
  - name: system::load balancer1
    id: c3lzdGVtOjpsb2FkIGJhbGFuY2VyMQ==.1
    value: 0
  - name: system::load balancer2
    id: c3lzdGVtOjpsb2FkIGJhbGFuY2VyMg==.1
    value: 0
```

The `contains` does an unordered list verification, in order to do list verifications including orders, you can simply use the basic ruls like this:

```yaml
# expected.data.yaml
metrics:
  - name: p99
    value: {{ gt (index .metrics 0).value 0 }}
  - name: p95
    value: {{ gt (index .metrics 1).value 0 }}
```

which expects the actual `metrics` list to be exactly ordered, with first element named `p99` and `value` greater 0, second element named `p95` and `value` greater 0.
