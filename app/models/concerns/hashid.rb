module Hashid
  extend ActiveSupport::Concern

  ALPHABET = "abcdefghijklmnopqrstuvwxyz" + "0123456789";
  SALT = "8asfnasdf90&98asj9a-88asd7f86tasdybasd?faosdf8u";
  MULT = 1970
  SIG = "ghijklmnopqrstuvwxyz"

  included do
  end

  module ClassMethods
    def hashid_generator
      @@hgen ||= Hashids.new(SALT, 0, ALPHABET)
    end

    def hashid(rid)
      return rid 

      #if Rails.env.development?

      SIG[rid % SIG.length] + hashid_generator.encode(rid * MULT)
    end

    def dehashid(hid)
      if looks_like_hashid?(hid)
        hid = hid[1..-1]
        hashid_generator.decode(hid.downcase)[0] / MULT
      else
        hid
      end
    end

    def find(hid, opts={})
      hid = dehashid(hid)
      super(hid, opts)
    end

    def find_safe(hid, opts={})
      hid = hashid(hid)
      super(hid, opts)
    end

    def looks_like_hashid?(hid)
      !SIG.index(hid[0].to_s.downcase).nil?
    end

  end

  def hashid
    self.class.hashid(self.id)
  end
end
