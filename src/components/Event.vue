<template>
  <el-main id="main">
    <el-container>
      <el-main>
        <div :v-model="event" class="grid-content">{{event}}</div>
      </el-main>
      <el-aside width="150px">
        <el-scrollbar height="400px">
          Similiar events
        </el-scrollbar>
      </el-aside>
    </el-container>
  </el-main>
</template>

<script>
export default {
  name: "Event.vue",
  data() {
    return {
      eventId: '',
      event: null,
    }
  },
  mounted() {
    let eventId = this.$route.params.id
    this.getEventInfo(eventId);
  },
  methods: {
    async getEventInfo(eventId) {
      this.eventId = eventId;
      console.log(99);
      await this.axios.get('http://localhost:4941/api/v1/events/' + this.eventId)
        .then((response) => {
          this.event = response.data;
          console.log(this.event);
        })
    }
  }
}
</script>

<style scoped>
#main {
  font-family: 'Ubuntu', sans-serif;

  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto auto;
  grid-row-gap: 1em;
  max-width: 95%;
  height: 600px;
  background-color: white;
  margin: 1em auto;
  padding: 0.5em 0 0.5em 0;
  border-radius: 20px;
  border: 2px solid rgba(0, 0, 0, 0.02);
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15);
}
</style>