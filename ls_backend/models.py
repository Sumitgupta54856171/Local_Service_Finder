from django.db import models
from django.contrib.gis.db import models
from django.contrib.auth.hashers import make_password
class User(models.Model):
     ROLE_CHOICES = (
          ('admin', 'Admin'),
          ('public', 'Public'),
     )
     username = models.CharField(max_length=250,unique=True)
     email = models.CharField(max_length=250,unique=True)
     password = models.CharField(max_length=100)
     role = models.CharField(max_length=100,choices=ROLE_CHOICES,default="public")
     crerated_at = models.DateTimeField(auto_now_add=True)

     def save(self, *args, **kwargs):
          # Password hashing industry standard hai
          from django.contrib.auth.hashers import identify_hasher
          try:
               identify_hasher(self.password)
          except ValueError:
               self.password = make_password(self.password)
          super().save(*args, **kwargs)

     def __str__(self):
        return self.username

class Servicer(models.Model):
     CATEGORY_CHOICES = (
          ('Hospital', 'Hospital'),
          ('ATM', 'ATM'),
          ('Shop', 'Shop'),
          ('Other', 'Other'),
     )


     name = models.CharField(max_length=255)
     category = models.CharField(max_length=100,choices=CATEGORY_CHOICES)
     location = models.PointField(null=True, blank=True)
     rating = models.FloatField(null=True, blank=True)
     created_at = models.DateTimeField(auto_now_add=True)
     class Meta:
          indexes =[
               models.Index(fields=['category'])
          ]


     def __str__(self):
          return self.name
