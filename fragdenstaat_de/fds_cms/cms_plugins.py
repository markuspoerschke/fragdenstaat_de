from django.utils.translation import ugettext_lazy as _

from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool

from .models import PageAnnotationCMSPlugin, DocumentPagesCMSPlugin


@plugin_pool.register_plugin
class PageAnnotationPlugin(CMSPluginBase):
    model = PageAnnotationCMSPlugin
    module = _("Document")
    name = _("Page Annotation")
    text_enabled = True
    render_template = "document/cms_plugins/page_annotation.html"
    raw_id_fields = ('page_annotation',)

    def render(self, context, instance, placeholder):
        context = super(PageAnnotationPlugin, self)\
            .render(context, instance, placeholder)

        context['object'] = instance.page_annotation

        return context


@plugin_pool.register_plugin
class DocumentPagesPlugin(CMSPluginBase):
    model = DocumentPagesCMSPlugin
    module = _("Document")
    name = _("Document pages")
    text_enabled = True
    render_template = "document/cms_plugins/document_pages.html"
    raw_id_fields = ('doc',)

    def render(self, context, instance, placeholder):
        context = super(DocumentPagesPlugin, self)\
            .render(context, instance, placeholder)

        context['object'] = instance.doc
        context['pages'] = instance.get_pages()

        return context
