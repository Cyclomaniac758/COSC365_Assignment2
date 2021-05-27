<template>
  <el-button class="button" align="left" @click="showCreateEvent=true" v-if="$route.path=='/'"> Create Event</el-button>
  <el-dialog v-model="showCreateEvent" title="Create Event" width="50%">
    <el-form ref="createEvent" :model="createEvent" :rules="createRules">
      <el-form-item label="Title" prop="title">
        <el-input v-model="eventForm.title"></el-input>
      </el-form-item>
      <el-form-item label="Date" prop="date">
        <el-input v-model="eventForm.date"></el-input>
      </el-form-item>
      <el-form-item label="Categories" prop="category">
        <el-select v-model="eventForm.category">

        </el-select>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="eventForm.description"></el-input>
      </el-form-item>
      <el-form-item>
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
        <el-input v-model="eventForm.maxCapacity"></el-input>
      </el-form-item>
      <el-form-item label="Event Type" prop ="isOnline">
        <el-select v-model="eventForm.isOnline" placeholder="Select">
          <el-option
              v-for="item in ['Online', 'In-person']"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Url" prop="url">
        <el-input v-model="eventForm.url"></el-input>
      </el-form-item>
      <el-form-item label="Venue" prop="venue">
        <el-input v-model="eventForm.venue"></el-input>
      </el-form-item>
      <el-form-item prop="controlAttendance">
        <el-checkbox v-model="eventForm.controlAttendance" label="Control Attendance Status"></el-checkbox>
      </el-form-item>
      <el-form-item label="Fee" prop="fee">
        <el-input v-model="eventForm.fee"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createEvent()">Create Event</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "createEvent",
  data: function() {
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
      createRules: {
        title: [
          { required: true, message: 'Title is required', trigger: 'blur' }
        ],
        date: [
          { required: true, message: 'Date is required', trigger: 'blur' }
        ],
        category: [
          { required: true, message: 'Category is required', trigger: 'blur' }
        ],
        image: [
          { required: true, message: 'Image is required', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'Description is required', trigger: 'blur' }
        ],
        maxCapacity: [
          { required: true, message: 'Max capacity is required', trigger: 'blur' }
        ],
        isOnline: [
          { required: true, message: 'Event type is required', trigger: 'blur' }
        ],
        url: [
          { required: true, message: 'Url is required', trigger: 'blur' }
        ],
        venue: [
          { required: true, message: 'Venue is required', trigger: 'blur' }
        ],
        controlAttendance: [
          { required: true, message: 'Specify whether attendance control is required', trigger: 'blur' }
        ],
        Fee: [
          { required: true, message: 'Fee is required', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    removeImage() {
      this.eventForm['image'] = '';
    },
    updateImage(file) {
      this.eventForm['image'] = file.raw;
    },
    async createEvent() {
      this.$refs['createEvent'].validate((valid) => function() {
        if (valid) {
          console.log(this.eventForm);
          let isOnline = (this.eventForm['isOnline'] === 'Online');
          let title = this.eventForm['title'];
          let description = this.eventForm['description'];
          let categoryIds = this.eventForm['category'];
          let date = this.eventForm['date'];
          let url = this.eventForm['url'];
          let venue = this.eventForm['venue'];
          let capacity = this.eventForm['maxCapacity'];
          let requiresAttendanceControl = this.eventForm['controlAttendance'];
          let fee = this.eventForm['fee'];
          let imageType = this.eventForm['image'].type;
          console.log(imageType)

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
              let eventId = res.data
              let image = this.eventForm['image']
              this.axios.put('http://localhost:4941/api/v1/events/' + eventId + '/image', {image},
                  {
                    headers: {
                      'X-Authorization': localStorage.getItem('token'),
                      'Content-Type': imageType
                    }
                  })
            })
          }
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