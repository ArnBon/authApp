import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from 'environments/environments';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces';
import { AuthStatus } from '../interfaces/auth-status-enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authstatus  = signal<AuthStatus>(AuthStatus.checking);


  constructor() { }

  login(email: string, password: string):Observable<boolean>{
    return of (true);

  }


}
