# backend/notes/serializers.py

from rest_framework import serializers
from .models import Note, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        write_only=True, 
        queryset=Tag.objects.all(), 
        source='tags',
        required=False  # <--- 在这里添加这一行！
    )

    class Meta:
        model = Note
        fields = [
            'id', 'title', 'content', 'created_at', 'updated_at',
            'tags', 'tag_ids', 'is_favorite', 'is_trashed'
        ]