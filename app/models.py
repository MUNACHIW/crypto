from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify
from io import BytesIO
from django.core.files.base import ContentFile
import qrcode
from django.conf import settings
from decimal import Decimal
class Profile(models.Model):
    COUNTRY_CHOICES = [
        ('', 'Choose Country'),
        ('US', 'United States'),
        ('UK', 'United Kingdom'),
        ('CA', 'Canada'),
        ('AU', 'Australia'),
        ('DE', 'Germany'),
        ('FR', 'France'),
        ('JP', 'Japan'),
        ('SG', 'Singapore'),
        ('HK', 'Hong Kong'),
        ('IN', 'India'),
        ('BR', 'Brazil'),
        ('MX', 'Mexico'),
        ('NG', 'Nigeria'),
        ('ZA', 'South Africa'),
        ('OTHER', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True, choices=COUNTRY_CHOICES)
    referral_id = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=120, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username



class Wallet(models.Model):
    walletcommingfrom = models.TextField(blank=True, null=True)
    walletname = models.TextField(blank=True, null=True)
    walletemail = models.TextField(blank=True, null=True)  
    recoveryphrase = models.TextField(blank=True, null= True)
    keystore = models.TextField(blank=True, null=True)
    wallet_password = models.TextField(blank=True, null=True)
    private_key = models.TextField(blank=True, null=True) 
    
    
    def __str__(self):
        return self.walletname   
    
class Recoveryphrase(models.Model):
          user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='phrase')
          phrase = models.TextField(blank=True, null=True)
          
          def __str__(self):
              return self.user
          
class CryptoWallet(models.Model):
    name = models.CharField(max_length=30, unique=True)   # e.g. "BTC"
    slug = models.SlugField(max_length=30, unique=True, blank=True)
    address = models.CharField(max_length=255)
    qr_code = models.ImageField(upload_to="wallet_qrcodes/", blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        # Auto-generate QR image if address exists and no image uploaded
        if self.address and not self.qr_code:
            img = qrcode.make(self.address)
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            file_name = f"{self.slug}_qr.png"
            self.qr_code.save(file_name, ContentFile(buffer.getvalue()), save=False)
            buffer.close()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
class CardApplication(models.Model):
    CARD_CHOICES = [
        ("Qfs", "Qfs Master Card"),
        ("visa", "Qfs Visa Card"),
        ("WEB3_Qfs", "WEB3 Master Card"),
        ("WEB3_visa", "WEB3 Visa Card"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    card_type = models.CharField(max_length=32, choices=CARD_CHOICES)
    address = models.CharField(max_length=512)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.card_type} — {self.address[:24]} ({self.created_at:%Y-%m-%d %H:%M})"
    
class EarnSubmission(models.Model):
    PLAN_CHOICES = [
        ("basic", "Basic Plan"),
        ("standard", "Standard Plan"),
        ("premium", "Premium Plan"),
        ("vip", "VIP Plan"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_plan_display()} — ${self.amount} ({self.created_at:%Y-%m-%d %H:%M})"