from django.contrib import messages
from django.contrib.auth import login
from django.shortcuts import redirect, render

from .forms import SignUpForm


def home(request):
    return render(request, "app/home.html")

def wallet(request):
    return render(request, "app/wallet.html" )


def signup(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Your account was created successfully.")
            return redirect("home")
    else:
        form = SignUpForm()

    return render(request, "app/signup.html", {"form": form})
