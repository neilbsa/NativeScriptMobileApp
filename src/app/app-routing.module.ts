import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { LoginComponent } from './shared/component/login/login.component'

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('~/app/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'login',
   component: LoginComponent
  },
  {
    path: 'warehouse',
    loadChildren: () => import('~/app/warehouse/warehouse.module').then((m) => m.WarehouseModule),
  },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
