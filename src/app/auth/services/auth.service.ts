import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from 'environments/environments';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthStatus, LoginResponse, User, CheckTokenResponse } from '../interfaces';
import { Token } from '@angular/compiler';




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


  constructor() {
     this.checkAuthStatus().subscribe();
   }

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

  //clase 367
  /*checkAuthStatus():Observable<boolean>{
    const url   = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if(!token){
      this.logout();
      return of(false);
    }
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer $ {token}`);
    return this.http.get<CheckTokenResponse>(url, {headers})
    .pipe(
      map( ({ token, user }) => {
        this._currentUser.set(user);
        this._authstatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token)
        return true;
      }),
      //Error
      catchError(() => {
        this._authstatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
      );
    }*/


    //clase 368 no te repitas a ti mismo DRY Dont Repeat Yourself
      private setAuthentication(user: User, token:string): boolean {
        this._currentUser.set(user);
        this._authstatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        return true;
      }

    //aqui esta refactorizado para la clase 368
   checkAuthStatus():Observable<boolean>{
    const url   = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if(!token){
      this.logout();
      return of(false);
    }
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer $ {token}`);
    return this.http.get<CheckTokenResponse>(url, {headers})
    .pipe(
      map( ({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authstatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
      );
    }


    logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authstatus.set( AuthStatus.notAuthenticated );

  }
  }



