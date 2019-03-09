<template lang="pug">
  .content-wrapper
    section
      .container
        .auth
          .auth__banner
            h1.ui-title-1 Hello banner
          .auth__form
            span.ui-title-1 Login
            form(@submit.prevent="onSubmit")
              .form-item(:class="{'errorInput': $v.email.$error }")
                input(
                  type="email"
                  placeholder="Email"
                  v-model="email"
                  :class="{'error': $v.email.$error }"
                  @change="$v.email.$touch()"
                )
                .error(v-if="!$v.email.required") Field is required
                .error(v-if="!$v.email.email") Email is not correct
              .form-item(:class="{'errorInput': $v.password.$error }")
                input(
                  type="password"
                  placeholder="password"
                  v-model="password"
                  :class="{'error': $v.password.$error }"
                  @change="$v.password.$touch()"
                )
                .error(v-if="!$v.password.required") Password is required.
                .error(v-if="!$v.password.minLength")
                  | Password must have at least {{ $v.password.$params.minLength.min }} letters.

              .buttons-list
                button.button.button-primary(
                  type="submit"
                  :class="{ 'button--disable': $v.$invalid }"
                ) Login
              .buttons-list.buttons-list--info
                p(v-if="submitStatus === 'OK'") Thanks for your submission!
                p(v-else) {{ submitStatus }}
              .buttons-list.buttons-list--info
                span Need Registration
                  router-link(to="/registration")  Enter Here

</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      email: '',
      password: '',
      repeatPassword: '',
      submitStatus: null
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    }
  },
  methods: {
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        console.log('Login!')
        const user = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('loginUser', user)
          .then(() => {
            this.$store.dispatch('loginUser', user)
            let message = {
              context: 'success',
              title: 'You are logged!'
            }
            this.$store.dispatch('getMessage', message)
            // this.submitStatus = 'OK'
            this.$router.push('/')
          })
          .catch(err => {
            this.submitStatus = err.message
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.auth
  display flex
  justify-content space-between
  flex-wrap wrap

.auth__banner,
.auth__form
  width 50%
  @media screen and (max-width: 768px)
    width 100%
    margin-bottom 30px
    &:last-child
      margin-bottom 0

.auth__form
  max-width 400px

.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13.4px
    color #fc5c65
  &.errorInput
    .error
      display block

input
  &.error
    border-color #fc5c65
    animation shake .3s

.buttons-list
  text-align right
  margin-bottom 20px
  &.buttons-list--info
    text-align center
    &:last-child
      margin-bottom 0

a
  color #444ce0
</style>
