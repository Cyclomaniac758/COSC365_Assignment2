<template>
  <div id="main">
    <el-container style="width: 100%" v-model="event">
        <el-header height="80px">
          <div :v-if="event != null" :v-model="event" class="grid-content" id="title">{{event.title}}</div>
          <div :v-if="event != null" :v-model="event" class="grid-content" style="text-align: center">{{ event.date }}</div>
        </el-header>
        <el-main :v-model="event">
          <el-divider></el-divider>
          <el-container>
            <el-aside>
              <el-image :src="'http://localhost:4941/api/v1/events/' + event.id + '/image'" fit="contain" style="width: 300px; height: 300px">              </el-image>
              <div>
                <div v-for="cat in filteredCategories" v-bind:key="cat">
                  <el-tag size="medium" style="width: auto; margin: 5px">{{cat}}</el-tag>
                </div>
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
                <el-image align="left" :src="'http://localhost:4941/api/v1/users/' + (event.organizerId) + '/image'" onerror="this.src = 'https://thepeakid.com/wp-content/uploads/2016/03/default-profile-picture.jpg'" fit="fill" style="width: 100px; height: 100px; border: thin solid #DCDFE6; border-radius: 5px">
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
                  <el-button type="primary" @click="attendeesVisible = true">
                    View Event Attendees
                  </el-button>
                </el-row>
              </el-main>
            </el-container>
          </div>
          <el-dialog
              title="Attendees"
              v-model="attendeesVisible"
              width="50%"
              :before-close="handleClose">
            <div>
                <el-main v-model="attendees">
                  <el-row v-for="attendee in attendees" v-bind:key="attendee" style="border: thin solid #DCDFE6; border-radius: 5px; margin: 10px">
                      <el-image style="width: 100px; height: 100px; border: thin solid #DCDFE6; border-radius: 5px; margin: 5px" :src="'http://localhost:4941/api/v1/users/' + (attendee.attendeeId) + '/image'" onerror="this.src = 'https://thepeakid.com/wp-content/uploads/2016/03/default-profile-picture.jpg'">
                      </el-image>
                    <div style="margin: 10px;">
                      {{attendee.firstName + ' ' + attendee.lastName}}
                    </div>
                    <el-tag v-model="event" style="margin: 10px; float: right" v-if="attendee.attendeeId  !== event['organizerId']">
                      attendee
                    </el-tag>
                    <el-tag  type=warning v-model="event" style="margin: 10px; float: right" v-if="attendee.attendeeId  === event['organizerId']">
                      organizer
                    </el-tag>
                    <el-tag v-model="event" style="margin: 10px; float: right">
                      <div>
                        {{attendee.status}}
                      </div>
                    </el-tag>
                  </el-row>
                </el-main>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="attendeesVisible = false">Close</el-button>
              </span>
            </template>
          </el-dialog>
        </el-main>
    </el-container>
    <div style="border: thin solid #DCDFE6; border-radius: 5px; width: 90%; margin: 5px;" v-if="similiarEvents">
        <el-scrollbar height="100%" style="margin: 10px" v-model="similiarEvents">
          <el-header height="5%" style="font-family: Helvetica; font-size: 20px; font-weight: bold; text-align: center; margin: 10px">Similar Events</el-header>
          <el-divider></el-divider>
          <el-row v-for="event1 in similiarEvents" :key="event1" style="border: thin solid #DCDFE6; border-radius: 5px; margin: 10px; align-content: center">
            <el-row>
              {{event1['title']}}
            </el-row>
            <el-row>
            <el-image fit="contain" style="width: 100px; height: 100px; border: thin solid #DCDFE6; border-radius: 5px; margin: 5px" :src="'http://localhost:4941/api/v1/events/' + (event1.eventId) + '/image'" onerror="this.src = 'https://thepeakid.com/wp-content/uploads/2016/03/default-profile-picture.jpg'">
            </el-image>
            </el-row>
          </el-row>
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
      attendeesVisible: false,
      attendees: [],
      categories: [],
      filteredCategories: [],
      similiarEvents: [],
      loggedIn: localStorage.getItem('token') !== null
    }
  },
  mounted() {
    this.getEventInfo();
    this.getEventCategories();
    this.getEventAttendees();
    this.getSimiliarEvents();
    // localStorage.getItem()
  },
  methods: {
    async getEventInfo() {
      this.eventId = this.$route.params.id
      await this.axios.get('http://localhost:4941/api/v1/events/' + this.eventId)
        .then((response) => {
          this.event = response.data;
          console.log(this.event);
          this.event["date"] = moment(this.event["date"]).format('h:mm a MMMM dS yyyy')
        })
    },
    handleClose(done) {
      done();
      this.attendeesVisible = false
    },
    async getEventAttendees() {
      console.log(localStorage.getItem('auth'))
      if (localStorage.getItem('token') !== null) {
        console.log('loggedin');
        await this.axios.get('http://localhost:4941/api/v1/events/' + this.eventId + '/attendees',
            {
              headers: {
                'X-Authorization': localStorage.getItem('token')
              }
            })
            .then((res) => {
              this.attendees = res.data;
              console.log(this.attendees);
            });
      } else {
        await this.axios.get('http://localhost:4941/api/v1/events/' + this.eventId + '/attendees')
            .then((res) => {
              this.attendees = res.data;
              console.log(this.attendees);
            });
      }

    },
    async getEventCategories() {
      await this.axios.get('http://localhost:4941/api/v1/events/categories')
      .then((res) => {
        this.categories = res.data;
        for (let cat in this.categories) {
          for (let i=0; i<this.event['categories'].length; i++)
          if (this.categories[cat]['id'] === this.event['categories'][i]) {
            this.filteredCategories.push(this.categories[cat]['name'])
          }
        }
      })
    },
    async getSimiliarEvents() {
      await this.axios.get('http://localhost:4941/api/v1/events')
          .then((response) => {
            let events = response.data;
            events.reverse();
            events = events.filter(event => new Date(event.date) >= Date.now());
            events.map(item => {
              item.date = moment(item.date).format("DD-MM-YYYY HH:mm");
            });
            for (let item in events) {
              let list = events[item]['categories'].filter(value => this.event['categories'].includes(value));
              if (list.length > 0 && this.event['title'] !== events[item]['title']) {
                this.similiarEvents.push(events[item])
              }
            }
            console.log(this.similiarEvents)
          })
    },
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