from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name='notes')
    is_favorite = models.BooleanField(default=False)
    is_trashed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-updated_at'] # 默认按更新时间倒序排列