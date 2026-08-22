from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("wallet/", views.wallet, name='wallet' ),
    path("register/", views.signup, name="register"),
    path("login/", LoginView.as_view(template_name="app/login.html"), name="login"),
    
    path("logout/", LogoutView.as_view(next_page="login"), name="logout"),
]
