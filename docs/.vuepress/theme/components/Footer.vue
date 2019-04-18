<template>
  <footer class="footer-container">
    <div class="cols-container">
      <div class="clear">
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
  padding: 2rem 2em 0em;
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
  margin: 5px 0;
}
.footer-container .asf{
  width: 33%;
  float: left;
}
.footer-container  dd a {
  color: inherit;
}
.footer-container .copyright {
  padding-top: 10px;
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
.footer-container .cols-container{
    padding-right: 10px;
    padding-left: 10px;
    margin-bottom: 10px;
}
</style>
