from django.db import models
from django.contrib.auth.models import User

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    def __str__(self): return self.name

class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name='notes')
    is_favorite = models.BooleanField(default=False)
    is_trashed = models.BooleanField(default=False)
    order_index = models.IntegerField(default=0, db_index=True)
    owner = models.ForeignKey(User, related_name='notes', on_delete=models.CASCADE)
    
    def __str__(self): return self.title
    class Meta: ordering = ['order_index']