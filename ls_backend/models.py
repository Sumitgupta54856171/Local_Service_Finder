from django.db import models
from django.contrib.gis.db import models

class User(models.Model):
     username = models.CharField(max_length=250)
     email = models.CharField(max_length=250)
     password = models.CharField(max_length=100)
     crerated_at = models.DateTimeField(auto_now_add=True)

     def __str__(self):
        return self.username

class Servicer(models.Model):
     name = models.CharField(max_length=255)
     category = models.CharField(max_length=100)
     latitude = models.FloatField(null=True, blank=True)
     longitude = models.FloatField(null=True, blank=True)
     rating = models.FloatField(null=True, blank=True)
     created_at = models.DateTimeField(auto_now_add=True)

     def __str__(self):
          return self.name
