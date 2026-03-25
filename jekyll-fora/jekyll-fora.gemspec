Gem::Specification.new do |spec|
  spec.name          = "jekyll-fora"
  spec.version       = "1.0.0"
  spec.authors       = ["Giga Mobile"]
  spec.email         = ["hello@giga.mobile"]
  spec.summary       = "Fora comments for Jekyll — the fastest embeddable comment system"
  spec.description   = "A Jekyll plugin that adds a {% fora_comments %} Liquid tag for embedding Fora comment widgets on any Jekyll site."
  spec.homepage      = "https://giga.mobile"
  spec.license       = "MIT"

  spec.files         = Dir["lib/**/*", "README.md"]
  spec.require_paths = ["lib"]

  spec.add_runtime_dependency "jekyll", ">= 3.0", "< 5.0"
end
