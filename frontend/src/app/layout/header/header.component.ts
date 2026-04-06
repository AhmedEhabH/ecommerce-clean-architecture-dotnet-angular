import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);

  isAuthenticated$ = this.authService.authUser$.pipe(
    map(user => !!user)
  );
  authUser$ = this.authService.authUser$;

  logout(): void {
    this.authService.logout();
  }
}
