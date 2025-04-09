# frozen_string_literal: true

module IMDB
  class Configuration
    attr_accessor :access_token

    CONFIG_KEYS = %i[access_token].freeze

    def initialize
      @access_token = nil
    end
  end
end
