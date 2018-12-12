<template>
  <footer class="footer-container">
    <div class="cols-container">
      <div class="col col-18">
          <dl>
        <dt>Disclaimer</dt>
        <dd>
        <p>Apache SkyWalking (incubating) is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by Incubator. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF.</p>
            </dd>
             </dl>
      </div>
      <div class="col col-6">
        <dl>
          <dt>ASF</dt>
          <dd class="asf">
            <a href="http://www.apache.org/" target="_self">Foundation</a>
          </dd>
          <dd class="asf">
            <a href="http://www.apache.org/licenses/" target="_self">License</a>
          </dd>
          <dd class="asf">
            <a href="http://www.apache.org/events/current-event" target="_self">Events</a>
          </dd>
          <dd class="asf">
            <a href="http://www.apache.org/foundation/sponsorship.html" target="_self">Sponsorship</a>
          </dd>
          <dd class="asf">
            <a href="http://www.apache.org/foundation/thanks.html" target="_self">Thanks</a>
          </dd>
        </dl>
      </div>
    </div>
    <div
      class="copyright"
    >Copyright © 2017-2018, The Apache Software Foundation, Apache SkyWalking, SkyWalking, Apache, the Apache feather logo, and the Apache SkyWalking project logo are either registered trademarks or trademarks of the Apache Software Foundation.</div>
  </footer>
</template>

<script>
export default {};
</script>

<style>
.footer-container{
  padding: 2rem 2em 0.3em;
}
.footer-container dt{
  font-size: 16px;
  font-weight: bold;
  font-family: Avenir-Medium;
}
.footer-container  dd{
  margin: 0;
  font-size: 12px;
  color: #999;
  line-height: 18px;
  margin: 8px 0;
}
.footer-container .asf{
  width: 40%;
  float: left;
}
.footer-container  dd a {
  color: inherit;
}
.footer-container .copyright {
  border-top: 1px solid #eaecef;
  min-height: 60px;
  line-height: 20px;
  text-align: center;
  font-family: Avenir-Medium;
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
}
.footer-container .cols-container .col-18 {
    width: 75%;
    padding-right: 70px;
    padding-left: 10px;
}
.footer-container .cols-container .col-6 {
    width: 24%;
    padding-right: 10px;
    padding-left: 10px;
}
.footer-container .cols-container .col {
    display: inline-block;
    box-sizing: border-box;
    vertical-align: top;
}
@media screen and (max-width: 640px) {
  .footer-container .cols-container .col {
      width: 100%;
      text-align: center;
      padding: 0;
  }
}

</style>
