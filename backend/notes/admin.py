# backend/notes/admin.py

from django.contrib import admin
from .models import Note, Tag

# 创建一个更美观的后台显示配置
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_favorite', 'is_trashed', 'updated_at')
    list_filter = ('is_favorite', 'is_trashed', 'tags')
    search_fields = ('title', 'content')

# 将你的模型注册到 admin 后台
admin.site.register(Note, NoteAdmin)
admin.site.register(Tag)