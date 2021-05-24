<template>
  <div id="main">
    <el-container style="width: 100%">
        <el-header height="20px">
          <div :v-if="event != null" :v-model="event" class="grid-content" id="title">{{event.title}}</div>
          <div :v-if="event != null" :v-model="event" class="grid-content" style="text-align: center">{{ event.date }}</div>
        </el-header>
        <el-main :v-model="event">
          <el-divider></el-divider>
          <el-container>
            <el-aside>
              <el-image :src="'http://localhost:4941/api/v1/events/' + event.id + '/image'" fit="contain" style="width: 300px; height: 300px">
                <template #error>
                  <div class="image-slot">
                    <i class="el-icon-picture-outline">No Image</i>
                  </div>
                </template>
              </el-image>
              <div>
                sfbs
              </div>
            </el-aside>
            <el-main>
              <div style="margin: 20px">
              {{event.description}}
              </div>
              <div class="eventInfo" align="left">
                URL: {{ event.url }}
              </div>
              <div class="eventInfo" align="left">
                Venue: {{event.venue}}
              </div>
              <div class="eventInfo" align="left">
                Capacity: {{ event.capacity }}
              </div>
              <div v-if="event.fee > 0" class="eventInfo" align="left">
                Fee: {{ event.fee }}
              </div>
              <div v-if="event.fee == 0" class="eventInfo" align=left>
                Fee: free
              </div>
            </el-main>
          </el-container>
          <el-divider></el-divider>
          <div>
            <el-container>
              <el-aside width="50%">
                <el-col>
                <el-image align="left" :src="'http://localhost:4941/api/v1/users/' + (event.organizerId) + '/image'" fit="fill" style="width: 100px; height: 100px; border: thin solid #DCDFE6; border-radius: 5px">
                  <template #error>
                    <div class="image-slot">
                      <em class="el-icon-picture-outline">No Image</em>
                    </div>
                  </template>
                </el-image>
                </el-col>
                <el-col style="margin: 10px;">
                  Organizer: {{ event.organizerFirstName }} {{event.organizerLastName }}
                </el-col>
              </el-aside>
              <el-divider direction="vertical"></el-divider>
              <el-main>
                <el-row style="text-align: center; margin: 10px">
                  Accepted Attendees: {{event.attendeeCount}}
                </el-row>
                <el-row>
                  <el-button type="primary">
                    View Event Attendees
                  </el-button>
                </el-row>
              </el-main>
            </el-container>
          </div>
        </el-main>
    </el-container>
    <div style="border: thin solid #DCDFE6; border-radius: 5px; width: 90%; margin: 5px;">
        <el-scrollbar height="100%" style="margin: 10px">
          <!-- Todo similiar events -->
          ss
        </el-scrollbar>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: "Event.vue",
  data() {
    return {
      eventId: '',
      event: {},
    }
  },
  mounted() {
    let eventId = this.$route.params.id
    this.getEventInfo(eventId);
  },
  methods: {
    async getEventInfo(eventId) {
      this.eventId = eventId;
      await this.axios.get('http://localhost:4941/api/v1/events/' + this.eventId)
        .then((response) => {
          this.event = response.data;
          console.log(this.event);
          this.event["date"] = moment(this.event["date"]).format('h:mm a MMMM dS yyyy')
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
  grid-template-rows: auto;
  grid-row-gap: 1em;
  max-width: 95%;
  height: auto;
  background-color: white;
  margin: 1em auto;
  padding: 0.5em 0 0.5em 0;
  border-radius: 20px;
  border: 2px solid rgba(0, 0, 0, 0.02);
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15);
}
#title {
  font-weight: bold;
  text-align: center;
  font-size: 30px;
  margin-top: 10px;
}
.el-main {
  text-align: center;
}
.eventInfo {
  margin: 5px;
}
</style>