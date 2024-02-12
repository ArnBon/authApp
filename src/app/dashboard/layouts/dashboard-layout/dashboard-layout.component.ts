import { Component, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {

   private authService = inject( AuthService );

   /**metodo 1 */
  public user = computed(() => this.authService.currentUser() );

  //****metodo 2 *****//
  // get user() {
  //   return this.authService.currentUser();
  // }


  onLogout() {
    this.authService.logout();
  }

}
