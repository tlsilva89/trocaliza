import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) 
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { 
        path: 'home', 
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
      },
      { 
        path: 'postagens', 
        loadComponent: () => import('./pages/postagens/postagens.component').then(m => m.PostagensComponent) 
      },
      { 
        path: 'postagens/:id', 
        loadComponent: () => import('./pages/post-detail/post-detail.component').then(m => m.PostDetailComponent) 
      },
      { 
        path: 'minhas-postagens', 
        loadComponent: () => import('./pages/minhas-postagens/minhas-postagens.component').then(m => m.MinhasPostagensComponent),
        canActivate: [authGuard]
      },
      { 
        path: 'perfil', 
        loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
