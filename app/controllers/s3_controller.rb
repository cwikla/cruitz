class S3Controller < ApplicationController
  BUCKET_CH = "abcdefghijklmnopqrstuvwxyz0123456789".split('')
  MULT = 1029

  def self.rand_string(size=8)
    BUCKET_CH.shuffle[0,size].join
  end


  def get
    spar = s3_params
    name = spar[:name]

    name = File.basename(name) # only filename

    bucket = Pyr::Base::S3::Bucket.new(::S3_BUCKET_NAME)

    randDir = File.join((current_user.id * MULT).to_s, self.class.rand_string)
    randDir = nil

    url = bucket.signed_put_url(name, path: randDir)

    fullName = randDir ? File.join(randDir, name) : name

    puts "SIGNED URL [#{url}]"

    if url
      return render json: { url: url, name: fullName, path: randDir }
    else
      return render_create_error json: { url: url }
    end
  end

  private

  def s3_params
    params.require(:s3).permit(:name)
  end


end
