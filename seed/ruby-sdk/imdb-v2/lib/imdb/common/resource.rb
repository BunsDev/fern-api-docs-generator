# frozen_string_literal: true

module IMDB
  module Common
    class Resource
      def initialize(**args)
        @attributes = {}

        args.each do |k, v|
          set_attribute(k, v)
        end
      end

      def inspect
        "#<#{self.class.name} #{self.class.fields.keys.map { |k| "#{k}=#{@attributes[k].inspect}" }.join(" ")}>"
      end

      private def set_attribute(key, value)
        field = self.class.fields[key]

        return nil unless field

        field.validate_value!(value)

        @attributes[key] = value
      end

      class << self
        def fields
          @fields ||= {}
        end

        def field(name, **args)
          fields[name] = Field.new(name: name, **args)

          instance_eval do
            define_method(name.to_sym) { @attributes[name] }

            define_method("#{name.to_s}=".to_sym) do |value|
              set_attribute(name, value)
            end
          end
        end
      end
    end
  end
end
