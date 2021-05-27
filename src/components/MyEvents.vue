<template>
  <el-button v-if="$route.path=='/'" class="button" @click="showEvents=true">My Events</el-button>
  <el-dialog v-model="showEvents" title="My Events" width="90%">
  <el-table :data="events" style="width: 100%;" height="500" @current-change="goToEvent">
    <el-table-column label="Image" v-slot="scope" align="center">
      <el-image :src="'http://localhost:4941/api/v1/events/' + events[scope.$index]['eventId'] + '/image'" style="width: 100px; height: 100px">
        <template #error>
          <div class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </template>
      </el-image>
    </el-table-column>
    <el-table-column prop="date" label="Date">
    </el-table-column>
    <el-table-column prop="title" label="Title">
    </el-table-column>
    <el-table-column prop="categories" label="Categories" v-slot="scope" width="auto" align="center">
      <div v-for="category in events[scope.$index]['categories']" :key="category">
        <el-tag size="medium" style="width: auto; margin: 10px">{{category}}</el-tag>
      </div>
    </el-table-column>
    <el-table-column label="Organizer">
      <el-table-column label="Photo" v-slot="scope" align="center">
        <el-image :src="'http://localhost:4941/api/v1/users/' + (events[scope.$index]['orgId']) + '/image'" onerror="this.src = 'https://thepeakid.com/wp-content/uploads/2016/03/default-profile-picture.jpg'" style="width: 100px; height: 100px">
          <template #error>
            <div class="image-slot">
              <i class="el-icon-picture-outline">No Image</i>
            </div>
          </template>
        </el-image>
      </el-table-column>
      <el-table-column label="First Name" prop="organizerFirstName">
      </el-table-column>
      <el-table-column label="Last Name" prop="organizerLastName">
      </el-table-column>
    </el-table-column>
    <el-table-column prop="numAcceptedAttendees" label="Attendees">
    </el-table-column>
  </el-table>
  </el-dialog>
</template>

<script>
import moment from 'moment'
export default {
  name: "MyEvents",
  emits: ["goToEvent"],
  data: function() {
    return {
      showEvents: false,
      events: [],
      userId: localStorage.getItem('userId'),
      attendedEvents: []
    }
  },
  mounted() {
    this.getEvents()
  },
  methods: {
    goToEvent(val) {
      this.showEvents = false;
      this.$emit('goToEvent', val['eventId']);
    },
    async getEvents() {
      await this.axios.get('http://localhost:4941/api/v1/events')
          .then((response) => {
            this.events = response.data;
            this.events.reverse();
            this.events.map(item => {
              item.date = moment(item.date).format("DD-MM-YYYY HH:mm");
            });
          }, (error) => {
            this.error = error;
            this.errorFlag = true;
          });
      for (let i = 0; i < this.events.length; i++) {
        await this.axios.get('http://localhost:4941/api/v1/events/' + this.events[i]['eventId'])
            .then((response) => {
              this.events[i]['orgId'] = response.data['organizerId'];
            }, (error) => {
              this.error = error;
              this.errorFlag = true;
            });

      }
      await this.axios.get('http://localhost:4941/api/v1/events/categories')
          .then((res) => {
            let categories = res.data;
            for (let i = 0; i < this.events.length; i++) {
              let cats = [];
              for (let cat in categories) {
                for (let n = 0; n < this.events[i]['categories'].length; n++) {
                  if (categories[cat]['id'] === this.events[i]['categories'][n]) {
                    cats.push(categories[cat]['name'])
                  }
                }
              }
              this.events[i]['categories'] = cats;
            }
          })
      this.filterEvents();
    },
    async filterEvents() {
      for (let i = 0; i < this.events.length; i++) {
        await this.axios.get('http://localhost:4941/api/v1/events/' + this.events[i]['eventId'] + '/attendees')
            .then((res) => {
              let attendees = res.data;
              for (let attendee in attendees) {
                if (attendees[attendee]['attendeeId'].toString() === this.userId) {
                  this.attendedEvents.push(this.events[i]);
                }
              }
            }, (error) => {
              this.error = error;
              this.errorFlag = true;
            });
      }
      let events1 = this.events.filter(event => event['orgId'].toString() === this.userId);
      console.log(events1)
      let c = events1.concat(this.attendedEvents);
      this.events = c.filter((item, pos) => c.indexOf(item) === pos)
    }
  }
}
</script>

<style scoped>

</style>