# frozen_string_literal: true

require_relative "imdb/version"
require_relative "imdb/configuration"
require_relative "imdb/client"

require_relative "imdb/common/field"
require_relative "imdb/common/type"
require_relative "imdb/common/group"
require_relative "imdb/common/error"
require_relative "imdb/common/errors/field_error"

require_relative "imdb/types/movie"

require_relative "imdb/groups/imdb"

module IMDB
  class << self
    attr_writer :configuration

    def configuration
      @configuration ||= Configuration.new
    end

    def configure
      yield(configuration)
    end
  end
end
