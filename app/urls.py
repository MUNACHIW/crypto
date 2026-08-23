from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("wallet/", views.wallet, name='wallet' ),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("fund/", views.fund, name="fund"),
    path("fund_wallet/", views.fund_wallet, name="fund_wallet"),
    path("card/", views.card, name="card"),
    path("earn/", views.earn, name="earn"),
    path('swap/', views.swap, name="swap"),
    path("register/", views.signup, name="register"),
    path("signup/", views.signup, name="signup"),
    path("login/", views.CustomLoginView.as_view(), name="login"),
    
    path("logout/", LogoutView.as_view(next_page="login"), name="logout"),
]
