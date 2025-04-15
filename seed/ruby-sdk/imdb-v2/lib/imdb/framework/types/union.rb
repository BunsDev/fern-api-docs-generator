# frozen_string_literal: true

module Imdb
  module Framework
    module Types
      module Union
        extend Type

        def member(type, key: nil)
          members.push([type, key])
        end

        def members
          @members ||= []
        end

        def discriminator(key)
          @discriminator = key
        end

        def resolve_type(value)
          if @discriminator && value.is_a?(Hash)
            discriminator_value = value.fetch(@discriminator, nil)

            return nil if discriminator_value.nil?

            find_member_by_key(discriminator_value)
          else
            find_member_by_type(value)
          end
        end

        def resolve_type!(value)
          result = resolve_type(value)

          raise Errors::TypeError if result.nil?

          result
        end

        private def find_member_by_type(value)
          members.find { |member, _key| value.is_a?(member) }&.first
        end

        private def find_member_by_key(discriminator_value)
          members.find { |_member, key| key.to_sym == discriminator_value.to_sym }&.first
        end
      end
    end
  end
end
