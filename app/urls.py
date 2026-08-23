from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("wallet/", views.wallet, name='wallet' ),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("register/", views.signup, name="register"),
    path("signup/", views.signup, name="signup"),
    path("login/", views.CustomLoginView.as_view(), name="login"),
    
    path("logout/", LogoutView.as_view(next_page="login"), name="logout"),
]
