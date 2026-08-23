from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.contrib.auth.views import LoginView

from .forms import SignUpForm , LoginForm


def home(request):
    
    return render(request, "app/home.html")

def wallet(request):
    return render(request, "app/wallet.html" )


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
        messages.info(request, "You dont have an account with us.")

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

