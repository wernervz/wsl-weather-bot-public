import { Component } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'

import { LoopbackLoginService } from './lb-login.service'

@Component({
  selector: 'wsl-lb-login',
  templateUrl: './lb-login.component.html',
  styleUrls: ['./lb-login.component.css']
})
export class LoopbackLoginComponent {

  public loginForm: FormGroup // our model driven form
  public submitted: boolean // keep track on whether form is submitted
  public events: any[] = []
  public isError: boolean
  public errorMsg: string
  public buttonText: String = 'Submit'

  private credentials: any

  constructor(private _fb: FormBuilder, private loginService: LoopbackLoginService) {
    this.loginForm = this._fb.group({
       username: ['', Validators.required],
       password: ['', Validators.required],
       ttl: [36000]
    })
  }

  submitLogin() {
    this.credentials = this.loginForm.value
    // Logout previous token in session storage and remove token from session storage
    let stored = this.loginService.get()
    if (stored && stored.token) {
      this.loginService.logout().subscribe(
        success => {
          if (success) {
            this.loginService.destroyToken()
          } else {
            console.log('No Token found in session storage')
          }
        }
      )
    }
    // Reset the error
    this.isError = false
    // Use an observable to call the server and get an async response back
    this.loginService.login(this.credentials).subscribe(
      res => {
        console.log('Successfully logged in.')
        this.loginForm.reset()
      },
      err => {
        console.log('Error logging in.')
        console.log(err)
        this.isError = true
        this.errorMsg = err.message
        this.buttonText = 'Error Logging In'
        setTimeout(() => {
          this.buttonText = 'Submit'
          this.isError = false
        }, 2500)
    })
  }

}
