<template>
  <div class="blog">
      <div class="content">
        <div class="blog-item" v-for="i in data.blog">
          <h3>{{i.title}}</h3>
          <time>{{i.time}}</time>
          <p>{{i.short}}</p>
          <a :href="i.name+'.html'">Read more</a>
        </div>
      </div>
      <Footer/>
  </div>
</template>

<script>
import Footer from "../components/Footer.vue";

export default {
  components: { Footer },
  computed: {
    data() {
      return this.$page.frontmatter;
    }
  }
};
</script>

<style>
.blog{
  margin-top: -3.6rem;
}
.blog-item{
  border-bottom: 1px solid #eaecef;
}
.blog-item time{
  font-size: 12px;
  color: #888;
}
.blog-item h3{
  margin-bottom: 5px;
}
.blog-item a{
  display: inline-block;
  margin-bottom: 20px;
  font-size: 14px;
}
</style>