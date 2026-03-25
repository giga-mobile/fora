# Jekyll-Fora — Fora comments tag for Jekyll
#
# Usage in _config.yml:
#   fora_site_key: "your-site-key"
#
# Usage in posts/pages:
#   {% fora_comments %}
#   {% fora_comments site_key="your-site-key" theme="dark" %}
#   {% fora_comments site_key="your-site-key" accent="#8b5cf6" radius="8px" %}

module Jekyll
  class ForaCommentsTag < Liquid::Tag
    VALID_KEYS = %w[
      site_key page_id page_title theme container_id origin features
      accent bg surface text font radius
    ].freeze

    def initialize(tag_name, markup, tokens)
      super
      @attrs = {}
      markup.scan(/(\w+)\s*=\s*"([^"]*)"/) do |key, value|
        @attrs[key] = value if VALID_KEYS.include?(key)
      end
    end

    def render(context)
      site_key = @attrs['site_key'] || context.registers[:site].config['fora_site_key'] || ''
      page_id = @attrs['page_id'] || context['page']['url'] || context['page']['path'] || ''
      page_title = @attrs['page_title'] || context['page']['title'] || ''
      theme = @attrs['theme'] || 'auto'
      container_id = @attrs['container_id'] || 'fora-comments'
      origin = @attrs['origin'] || 'https://giga.mobile'
      features = @attrs['features'] || ''

      attrs = %(data-site-key="#{escape(site_key)}")
      attrs += %( data-page-id="#{escape(page_id)}") unless page_id.empty?
      attrs += %( data-page-title="#{escape(page_title)}") unless page_title.empty?
      attrs += %( data-theme="#{escape(theme)}")
      attrs += %( data-container-id="#{escape(container_id)}")
      attrs += %( data-features="#{escape(features)}") unless features.empty?

      # Theming overrides
      %w[accent bg surface text font radius].each do |key|
        val = @attrs[key]
        attrs += %( data-#{key}="#{escape(val)}") if val && !val.empty?
      end

      <<~HTML
        <div id="#{escape(container_id)}"></div>
        <script src="#{escape(origin)}/embed.js" #{attrs}></script>
      HTML
    end

    private

    def escape(str)
      CGI.escapeHTML(str.to_s)
    end
  end
end

Liquid::Template.register_tag('fora_comments', Jekyll::ForaCommentsTag)
