import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from 'environments/environments';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { LoginResponse, User } from '../interfaces';
import { AuthStatus } from '../interfaces/auth-status-enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authstatus  = signal<AuthStatus>(AuthStatus.checking);

  // al mundo exterior cualquier cosa que este fuera del servicio
  public currentUser = computed(() => this._currentUser());
  public authStatus  = computed(() => this._authstatus());


  constructor() { }

  login(email: string, password: string): Observable<boolean>{
    const url  = `${this.baseUrl}/auth/login`;
    const body = {email, password};

    return this.http.post<LoginResponse>(url, body)
    .pipe(
      tap(({user, token}) => {
        this._currentUser.set(user);
        this._authstatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        console.log({user, token});
      }),
      map(()=> true),

      //TO DO => POR HACER:
      catchError(err =>{
        console.log(err);
        return throwError(() => 'Algo salió mal!');

      })

    );


  }


}
