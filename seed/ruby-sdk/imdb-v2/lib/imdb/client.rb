# frozen_string_literal: true

require "faraday"

module IMDB
  class Client
    attr_reader(*Configuration::CONFIG_KEYS)

    def initialize(config = {})
      Configuration::CONFIG_KEYS.each do |key|
        instance_variable_set("@#{key}", config[key].nil? ? IMDB.configuration.send(key) : config[key])
      end
    end

    def get(path:)
      connection.get(path)
    end

    def post(path:, params: {})
      connection.post(path, params)
    end

    def imdb
      Groups::IMDB.new(client: self)
    end

    def connection
      @connection ||= Faraday.new do |f|
        f.url "https://example.com"
        f.response :json
      end
    end
  end
end
