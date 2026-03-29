from django.apps import AppConfig


class EducontentConfig(AppConfig):
    name = "educontent"

    def ready(self):
        # import signals so they are registered
        import educontent.signals
