<template>
  <el-button class="button" align="left" @click="showCreateEvent=true" v-if="$route.path=='/'"> Create Event</el-button>
  <el-dialog v-if="eventForm" v-model="showCreateEvent" title="Create Event" width="50%">
    <el-form ref="eventForm" :model="eventForm" :rules="createRules">
      <el-form-item label="Title" prop="title">
        <el-input v-model="eventForm.title"></el-input>
      </el-form-item>
      <el-form-item label="Activity Time" prop="date">
        <el-date-picker type="datetime" placeholder="Pick a date" v-model="eventForm.date" style="width: 100%;"></el-date-picker>
      </el-form-item>

        <!--      <el-form-item label="Activity Time">-->
<!--        <el-col :span="11">-->
<!--          <el-form-item prop="date1">-->
<!--            <el-date-picker type="date" placeholder="Pick a date" v-model="eventForm.date1" style="width: 100%;"></el-date-picker>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col class="line" :span="2">-</el-col>-->
<!--        <el-col :span="11">-->
<!--          <el-form-item prop="date2">-->
<!--            <el-time-picker placeholder="Pick a time" v-model="eventForm.date2" style="width: 100%;"></el-time-picker>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-form-item>-->
      <el-form-item label="Categories" prop="category">
        <el-select v-if="categories" v-model="eventForm.category" multiple>
          <el-option v-for="cat in categories"
                     :key="cat.id"
                     :label="cat.name"
                     :value="cat.id">

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="eventForm.description"></el-input>
      </el-form-item>
      <el-form-item prop="image">
        <el-upload
            action="#"
            class="avatar-uploader"
            :on-change="updateImage"
            :auto-upload="false"
            :limit="1"
            :before-remove="removeImage"
        >
          Upload Profile Image
        </el-upload>
      </el-form-item>
      <el-form-item label="Max Capacity" prop="maxCapacity">
        <el-input-number v-model="eventForm.maxCapacity" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="Event Type" prop ="isOnline">
        <el-select v-model="eventForm.isOnline" placeholder="Select">
          <el-option
              v-for="item in [{label: 'Online', value: true} , {label: 'In-person', value: false}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Url" prop="url">
        <el-input v-model="eventForm.url"></el-input>
      </el-form-item>
      <el-form-item label="Venue" prop="venue">
        <el-input v-model="eventForm.venue" :disabled="eventForm.isOnline === true"></el-input>
      </el-form-item>
      <el-form-item prop="controlAttendance">
        <el-checkbox v-model="eventForm.controlAttendance" label="Control Attendance Status"></el-checkbox>
      </el-form-item>
      <el-form-item label="Fee" prop="fee">
        <el-input v-model="eventForm.fee"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createEvent('eventForm')">Create Event</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "createEvent",
  data() {
    var ifOnline = (rule, value, callback) => {
      console.log(this.eventForm.isOnline)
      if (!value && this.eventForm.isOnline === true) {
        return callback(new Error('Online events must have url'));
      }
      setTimeout(() => {
         callback();
      }, 1000);
    };
    var ifInPerson = (rule, value, callback) => {
          console.log(this.eventForm)
          if (!value && this.eventForm.isOnline === false) {
            return callback(new Error('In person events must have venue'));
          } else if (value && this.eventForm.isOnline === true) {
            return callback(new Error('Online events cannot have venue'));
          }
          setTimeout(() => {
            callback();
          }, 1000);        }
    return {
      showCreateEvent: false,
      eventForm: {
        title: '',
        date: '',
        category: [],
        image: '',
        description: '',
        maxCapacity: '',
        isOnline: '',
        url: '',
        venue: '',
        controlAttendance: false,
        fee: 0.0
      },
      categories: [],
      createRules: {
        title: [
          { required: true, message: 'Title is required', trigger: 'change' }
        ],
        date: [
          { type: 'date', required: true, message: 'Please pick a date', trigger: 'change' },
        ],
        category: [
          { required: true, message: 'Category is required', trigger: 'change' }
        ],
        image: [
          { required: true, message: 'Image is required', trigger: 'change' }
        ],
        description: [
          { required: true, message: 'Description is required', trigger: 'change' }
        ],
        maxCapacity: [
          { required: false, trigger: 'change' }
        ],
        isOnline: [
          { required: true, message: 'Event type is required', trigger: 'change' }
        ],
        url: [
          { validator: ifOnline, trigger: 'change' }
        ],
        venue: [
          { validator: ifInPerson, trigger: 'change' }
        ],
        controlAttendance: [
          { required: true, message: 'Specify whether attendance control is required', trigger: 'change' }
        ],
        fee: [
          { required: true, message: 'Fee is required', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.axios.get('http://localhost:4941/api/v1/events/categories')
    .then((res) => {
      this.categories = res.data;
    })
  },
  methods: {
    removeImage() {
      this.eventForm['image'] = '';
    },
    updateImage(file) {
      this.eventForm['image'] = file.raw;
    },
    createEvent(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.eventForm['date'].getTime() > new Date().getTime()) {
            console.log(this.eventForm);
            let isOnline = (this.eventForm['isOnline'] === 'Online');
            let title = this.eventForm['title'];
            let description = this.eventForm['description'];
            let categoryIds = this.eventForm['category'];
            let date = new Date(this.eventForm['date'].getTime() - (this.eventForm['date'].getTimezoneOffset() * 60000)).toISOString().slice(0,-1).replace('T', ' ');
            let url = this.eventForm['url'];
            let venue = this.eventForm['venue'];
            let capacity = this.eventForm['maxCapacity'];
            let requiresAttendanceControl = this.eventForm['controlAttendance'];
            let fee = this.eventForm['fee'];
            let imageType = this.eventForm['image'].type;
            console.log(categoryIds)

            if (imageType === 'image/jpeg' || imageType === 'image/jpg' || imageType === 'image/png' || imageType === 'image/gif') {
              this.axios.post('http://localhost:4941/api/v1/events', {
                title,
                description,
                categoryIds,
                date,
                isOnline,
                url,
                venue,
                capacity,
                requiresAttendanceControl,
                fee
              }, {
                headers: {
                  'X-Authorization': localStorage.getItem('token')
                }
              }).then((res) => {
                console.log(res);
                let eventId = res.data['eventId']
                console.log(eventId)
                let image = this.eventForm['image']
                this.axios.put('http://localhost:4941/api/v1/events/' + eventId + '/image', image,
                    {
                      headers: {
                        'X-Authorization': localStorage.getItem('token'),
                        'Content-Type': imageType
                      }
                    })
                this.showCreateEvent = false;
              }).catch((err) => {
                console.log(err);
              })
            }
          } else {
            this.$message.warning('Event date must be in the future')
          }
        } else {
          console.log(9);
        }
      })
    }
  }
}
</script>

<style scoped>
.button {
  height: 25px;
  margin-right: 10px;
}
</style>