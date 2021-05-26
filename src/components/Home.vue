<template>
  <el-main id="main">
    <div style="width: 80%; margin-left: auto; margin-right: auto">
      <el-input placeholder="Search Events" v-model="input" style="width: 75%; padding-right: 20px ">
      </el-input>
      <el-button @click="search()" type="primary" icon="el-icon-search">Search</el-button>
    </div>
    <el-table :data="pagedTableData" :default-sort="{prop: 'date'}" style="width: 100%;" @sort-change="changeSort" height="500" @current-change="goToEvent">
      <el-table-column label="Image" v-slot="scope" align="center">
        <el-image :src="'http://localhost:4941/api/v1/events/' + events[scope.$index+pageSize*(page-1)]['eventId'] + '/image'" style="width: 100px; height: 100px">
          <template #error>
            <div class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </template>
        </el-image>
      </el-table-column>
      <el-table-column prop="date" label="Date" sortable="custom">
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
          <el-image :src="'http://localhost:4941/api/v1/users/' + (events[scope.$index+pageSize*(page-1)]['orgId']) + '/image'" onerror="this.src = 'https://thepeakid.com/wp-content/uploads/2016/03/default-profile-picture.jpg'" style="width: 100px; height: 100px">
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
      <el-table-column prop="numAcceptedAttendees" label="Attendees" sortable="custom">
      </el-table-column>
    </el-table>
    <el-pagination
        small
        layout="prev, pager, next"
        page-size="10"
        :total="getEventsSize"
        @current-change="setPage"
    ></el-pagination>
  </el-main>
</template>

<script>
import moment from 'moment'
export default {
  name: "Home.vue",
  data() {
    return{
      error: "",
      errorFlag: false,
      events: [],
      input: "",
      url: "",
      dateSort: '',
      attendeeSort: '',
      moment,
      allEvents: [],
      page: 1,
      pageSize: 10,
      categories: []
    }
  },
  mounted() {
    this.getEvents();
  },
  methods: {
    goToEvent(val) {
      this.$router.push({path: '/event/' +(val['eventId'])})
    },
    setPage(val) {
      this.page = val;
    },
    async getEvents() {
      await this.axios.get('http://localhost:4941/api/v1/events')
      .then((response) => {
        this.events = response.data;
        this.events.reverse();
        this.events = this.events.filter(event => new Date(event.date) >= Date.now());
        this.events.map(item => {
          item.date = this.moment(item.date).format("DD-MM-YYYY HH:mm");
        });
        this.allEvents = this.events;
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
            this.categories = res.data;
            for (let i = 0; i < this.events.length; i++) {
              let cats = [];
              for (let cat in this.categories) {
                for (let n = 0; n < this.events[i]['categories'].length; n++) {
                  if (this.categories[cat]['id'] === this.events[i]['categories'][n]) {
                    cats.push(this.categories[cat]['name'])
                  }
                }
              }
              this.events[i]['categories'] = cats;
            }
          })
    },

    search() {
      let newList = [];
      this.events = this.allEvents;
      for (let event in this.events) {
        console.log(this.events[event]['title'])
        if (this.events[event]['title'].toLowerCase().includes((this.input.toLowerCase()))) {
          newList.push(this.events[event]);
        }
      }
      this.events=newList;
      console.log(newList)

    },

    changeSort(column) {
      console.log(column);
      const fieldName = column.prop;
      const sortingType = column.order;

      if(fieldName=="date" || fieldName==null){
        this.events.map(item => {
          item.date = this.moment(item.date).valueOf();
        });
      }

      if(sortingType == "descending"){
        this.events = this.events.sort((a, b) => b[fieldName] - a[fieldName]);
      } else if (fieldName == null) {
        this.events = this.events.sort((a, b) => a['date'] - b['date']);
      }
      //Sort in ascending order
      else{
        this.tableData = this.events.sort((a, b) => a[fieldName] - b[fieldName]);
      }

      if(fieldName=="date" || fieldName==null){
        this.events.map(item => {
          item.date = this.moment(item.date).format(
              "YYYY-MM-DD HH:mm"
          );
        });
      }
    },
  },
  computed: {
    pagedTableData() {
      return this.events.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page)
    },
    getEventsSize() {
      return this.events.length
    }
  },
}
</script>

<style scoped>
#main {
  font-family: 'Ubuntu', sans-serif;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  grid-row-gap: 1em;

  max-width: 95%;
  background-color: white;
  margin: 1em auto;
  padding: 0.5em 0 0.5em 0;
  border-radius: 20px;
  border: 2px solid rgba(0, 0, 0, 0.02);
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15);
}

</style>