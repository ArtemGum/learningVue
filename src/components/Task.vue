<template lang="pug">
  .content-wrapper
    section
      .container
        .task-list__header
          h1.ui-title-1 Library
          .buttons-list
            .button.button--round.button-default(
              @click="filter='active'"
            ) Active
            .button.button--round.button-default(
              @click="filter='completed'"
            ) Completed
            .button.button--round.button-default(
              @click="filter='all'"
            ) All
        .task-list
          transition-group(name="taskList")
            .task-item(
              v-for="task in tasksFilter"
              :key="task.id"
              :class="{ completed: task.completed }"
            )
              .ui-card.ui-card--shadow
                .task-item__info
                  .task-item__main-item__info
                    span.ui-label(
                      :class="[{ 'ui-label--primary': !task.completed}, {'ui-label--light': task.completed }]"
                    ) {{ task.whatWatch }}
                    span Total Time: {{ task.time }}
                  span.button-close(
                    @click="deleteTask(task.id)"
                  )
                .task-item__content
                  .task-item__header
                    .ui-checkbox-wrapper
                      input.ui-checkbox(
                        type='checkbox'
                        v-model="task.completed"
                        @click="taskCompleted(task.id, task.completed)"
                        )
                    span.ui-title-2 {{ task.title }}
                  .task-item__body
                    p.ui-text-regular {{ task.description }}
                  .task-item__footer
                    .tag-list
                      .ui-tag__wrapper(
                        v-for="tag in task.tags"
                        :key="tag.title"
                      )
                        .ui-tag
                          span.tag-title {{ tag.title }}
                      .buttons-list
                        .button.button--round.button-default(
                          @click="taskEdit(task.id, task.title, task.description)"
                        ) Edit
                        .button.button--round(
                          @click="taskCompleted(task.id, task.completed)"
                          :class="[{ 'button-primary': !task.completed}, { 'button-light': task.completed}]"
                        )
                          span(v-if="task.completed") Return
                          span(v-else) Done

    .ui-messageBox__wrapper(
      v-if="editingPopup"
      @click="cancelTaskEdit"
      :class="{active: editingPopup}"
    )
      .ui-messageBox.fadeInDown(
        @click.stop=""
      )
        .ui-messageBox__header
          span.messageBox-title {{ titleEditing }}
          span.button-close(@click="cancelTaskEdit")
        .ui-messageBox__content
          p Title
          input(
            type="text"
            v-model='titleEditing'
            @keyup.esc="cancelTaskEdit"
          )
          p Description
          textarea(
            type="text"
            v-model="descEditing"
            @keyup.esc="cancelTaskEdit"
          )
        .ui-messageBox__footer
          .button.button-light(@click="cancelTaskEdit") Cancel
          .button.button-primary(@click="finishTaskEdit") OK
</template>

<script>
export default {
  data () {
    return {
      filter: 'active',
      editingPopup: false,
      completed: false,
      titleEditing: '',
      descEditing: '',
      taskId: null
    }
  },
  methods: {
    taskCompleted (id, completed) {
      completed ? completed = false : completed = true

      this.$store.dispatch('completedTask', {
        id,
        completed
      })
        .then(() => {
          console.log(completed)
          // this.$store.dispatch('loadTasks')
        })
    },
    taskEdit (id, title, description) {
      this.editingPopup = !this.editingPopup
      // console.log({id, title, description})
      this.taskId = id
      this.titleEditing = title
      this.descEditing = description
    },
    cancelTaskEdit () {
      this.editingPopup = !this.editingPopup
      // Reset
      this.taskId = null
      this.titleEditing = ''
      this.descEditing = ''
    },
    finishTaskEdit () {
      this.$store.dispatch('editTask', {
        id: this.taskId,
        title: this.titleEditing,
        description: this.descEditing
      })
      this.editingPopup = !this.editingPopup
    },
    deleteTask (id) {
      this.$store.dispatch('deleteTask', id)
        .then(() => {
          console.log('task deleted')
          this.$store.dispatch('loadTasks')
        })
    }
  },
  computed: {
    tasksFilter () {
      if (this.filter === 'active') {
        return this.$store.getters.taskNotCompleted
      } else if (this.filter === 'completed') {
        return this.$store.getters.taskCompleted
      } else if (this.filter === 'all') {
        return this.$store.getters.tasks
      }
      return this.filter === 'active'
    },
    tasks () {
      return this.$store.getters.tasks
    }
  }
}
</script>

<style lang="stylus" scoped>
.task-list__header
  display flex
  justify-content space-between
  align-items center
  margin-bottom 30px
  .ui-title-1
    margin-bottom 0

.task-item
  margin-bottom 20px
  .ui-checkbox:checked:before
    border-color #909399
  &.completed
    .ui-title-2,
    .ui-text-regular,
    .ui-tag
      text-decoration line-through
      color #909399
  &:last-child
    margin-bottom 0

.total-time
  margin-bottom 20px

.ui-label
  margin 8px

.task-item__info
  display flex
  align-items center
  justify-content space-between
  margin-bottom 20px
  .button-close
    width 20px
    height @width

.task-item__header
  display flex
  align-items center
  margin-bottom 18px
  .ui-checkbox-wrapper
    margin-right 8px
  .ui-title-2
    margin-bottom 6px

.task-item__body
  margin-bottom 20px

.tag-list
  margin-bottom 20px

.task-item__footer
  .buttons-list
    text-align right

.buttons-list
  .button
    margin-right 12px
    &:last-child
      margin-right 0

.ui-messageBox__wrapper
  &.active
    display flex
  .button-light
    margin-right 8px
</style>
