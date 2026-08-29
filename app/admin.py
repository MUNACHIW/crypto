from django.contrib import admin

from .models import Profile , Wallet


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "location", "created_at")
    search_fields = ("user__username", "location")

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("walletcommingfrom", "walletname","walletemail")
    search_fields = ("walletcommingfrom","walletemail")