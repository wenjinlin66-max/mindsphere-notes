# backend/notes/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note, Tag

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), source='tags', many=True, write_only=True, required=False)
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    class Meta:
        model = Note
        fields = [
            'id', 'title', 'content', 'created_at', 'updated_at',
            'tags', 'tag_ids', 'is_favorite', 'is_trashed',
            'order_index', 'owner_username'
        ]
        read_only_fields = ('owner',) # 【关键】: 明确声明 owner 是只读的