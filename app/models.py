from django.contrib.auth.models import User
from django.db import models


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