import { Component, OnInit } from '@angular/core';
import * as braintree from 'braintree-web';
import {ModalController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-braintree',
  templateUrl: './braintree.page.html',
  styleUrls: ['./braintree.page.scss'],
})
export class BraintreePage implements OnInit {
  hostedFieldsInstance: braintree.HostedFields;
  cardholdersName: string;
  Userdata;
  constructor(public modalController: ModalController ,
              public authservice: AuthService ,
              private location: Location ) { }

  ngOnInit() {
    const success = 'success';
    this.authservice.GetData().then( data => {
      if (data){
        this.Userdata = data[success];
        console.log(this.Userdata);
      }
    });
    this.createBraintreeUI();
  }

  createBraintreeUI() {
    braintree.client.create({
      authorization: 'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjMkZ1WkdKdmVDSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbk5oYm1SaWIzZ3VZbkpoYVc1MGNtVmxaMkYwWlhkaGVTNWpiMjBpZlEuZXlKbGVIQWlPakUyTVRZeU5EUXpOemNzSW1wMGFTSTZJakE0TmpCbFkyRmxMVEEzTlRRdE5EY3pOaTFpTlRReExXUm1aak5rWTJNd05XUTRNaUlzSW5OMVlpSTZJbXA1YTNsdWNYTmtaMlEyZW5salluUWlMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRndhUzV6WVc1a1ltOTRMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SWl3aWJXVnlZMmhoYm5RaU9uc2ljSFZpYkdsalgybGtJam9pYW5scmVXNXhjMlJuWkRaNmVXTmlkQ0lzSW5abGNtbG1lVjlqWVhKa1gySjVYMlJsWm1GMWJIUWlPbVpoYkhObGZTd2ljbWxuYUhSeklqcGJJbTFoYm1GblpWOTJZWFZzZENKZExDSnpZMjl3WlNJNld5SkNjbUZwYm5SeVpXVTZWbUYxYkhRaVhTd2liM0IwYVc5dWN5STZlMzE5LnJGVG9yLUp5MEoycWNxdWxVM1MzVzVraDFsNlhMVlk0eHJFbkNfa0lzQ2FvZVkxNVRYeXlRM3M4czJJR3Z5SERtb1ppaXVIc1IyX2E4TW9QdGtCNVhnIiwiY29uZmlnVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL2p5a3lucXNkZ2Q2enljYnQvY2xpZW50X2FwaS92MS9jb25maWd1cmF0aW9uIiwiZ3JhcGhRTCI6eyJ1cmwiOiJodHRwczovL3BheW1lbnRzLnNhbmRib3guYnJhaW50cmVlLWFwaS5jb20vZ3JhcGhxbCIsImRhdGUiOiIyMDE4LTA1LTA4IiwiZmVhdHVyZXMiOlsidG9rZW5pemVfY3JlZGl0X2NhcmRzIl19LCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvanlreW5xc2RnZDZ6eWNidC9jbGllbnRfYXBpIiwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwibWVyY2hhbnRJZCI6Imp5a3lucXNkZ2Q2enljYnQiLCJhc3NldHNVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImF1dGhVcmwiOiJodHRwczovL2F1dGgudmVubW8uc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbSIsInZlbm1vIjoib2ZmIiwiY2hhbGxlbmdlcyI6W10sInRocmVlRFNlY3VyZUVuYWJsZWQiOnRydWUsImFuYWx5dGljcyI6eyJ1cmwiOiJodHRwczovL29yaWdpbi1hbmFseXRpY3Mtc2FuZC5zYW5kYm94LmJyYWludHJlZS1hcGkuY29tL2p5a3lucXNkZ2Q2enljYnQifSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImJpbGxpbmdBZ3JlZW1lbnRzRW5hYmxlZCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJhbGxvd0h0dHAiOnRydWUsImRpc3BsYXlOYW1lIjoiY3Jvd2QiLCJjbGllbnRJZCI6bnVsbCwicHJpdmFjeVVybCI6Imh0dHA6Ly9leGFtcGxlLmNvbS9wcCIsInVzZXJBZ3JlZW1lbnRVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vdG9zIiwiYmFzZVVybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9jaGVja291dC5wYXlwYWwuY29tIiwiZGlyZWN0QmFzZVVybCI6bnVsbCwiZW52aXJvbm1lbnQiOiJvZmZsaW5lIiwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwibWVyY2hhbnRBY2NvdW50SWQiOiJjcm93ZCIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9fQ=='
    }).then((clientInstance) => {
      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          'ion-input': {
            'font-size': '16pt',
            'color': '#3A3A3A'
          },

          '.number': {
            'font-family': 'monospace'
          },

          '.valid': {
            'color': 'green'
          }
        },
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '1111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '111'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: 'MM/YY'
          }
        }
      }).then((hostedFieldsInstance) => {
        this.hostedFieldsInstance = hostedFieldsInstance;

        hostedFieldsInstance.on('focus', (event) => {
          //const field = event.fields[event.emittedBy];
          //const label = this.findLabel(field);
          //label.classList.remove('filled'); // added and removed css classes
          // can add custom code for custom validations here
        });

        hostedFieldsInstance.on('blur', (event) => {
         // const field = event.fields[event.emittedBy];
          //const label = this.findLabel(field); // fetched label to apply custom validations
          // can add custom code for custom validations here
        });

        hostedFieldsInstance.on('empty', (event) => {
         // const field = event.fields[event.emittedBy];
          // can add custom code for custom validations here
        });

        // hostedFieldsInstance.on('validityChange', (event) => {
        //   const field = event.fields[event.emittedBy];
        //   const label = this.findLabel(field);
        //   if (field.isPotentiallyValid) { // applying custom css and validations
        //     label.classList.remove('invalid');
        //   } else {
        //     label.classList.add('invalid');
        //   }
        //   // can add custom code for custom validations here
        // });
      } , err => {
        console.log(err);
      });
    });
  }


  tokenizeUserDetails() {
    this.hostedFieldsInstance.tokenize({cardholderName: this.cardholdersName}).then((payload) => {
      console.log(payload);
      // submit payload.nonce to the server from here
    }).catch((error) => {
      console.log(error);
      // perform custom validation here or log errors
    });
  }

  // Fetches the label element for the corresponding field
  findLabel(field: braintree.HostedFieldsHostedFieldsFieldData) {
    console.log('sdfs');
    return document.querySelector('.hosted-field--label[for="' + field.container.id + '"]');
  }
}
