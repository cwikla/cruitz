class S3Controller < ApplicationController
  def self.bucket
  end

  def self.signed(name)
    self.bucket.signed_put_url(name)
  end

  def get
    bucket = Pyr::Base::S3::Bucket.new(::S3_BUCKET_NAME, ::S3_BUCKET_SUBDIR, rand_sub_dir: true)
    url = bucket.signed_put_url(params[:name])

    if url
      return render json: { url: url }
    else
      return render_create_error json: { url: url }
    end
  end

  private

  def s3_params
    params.require(:s3).permit(:name)
  end


end
